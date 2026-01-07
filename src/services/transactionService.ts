import { ref, set, remove, onValue, off, get } from 'firebase/database';
import { database, auth } from '@/lib/firebase';
import { Transaction } from '@/types/finance';

const STORAGE_KEY = 'webcods-gross-transactions';

/**
 * Get the database reference for the current user's transactions
 */
const getTransactionsRef = (userId: string) => {
    return ref(database, `users/${userId}/transactions`);
};

/**
 * Get the database reference for a specific transaction
 */
const getTransactionRef = (userId: string, transactionId: string) => {
    return ref(database, `users/${userId}/transactions/${transactionId}`);
};

/**
 * Save a new transaction to Firebase
 */
export const saveTransaction = async (transaction: Transaction): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const transactionRef = getTransactionRef(user.uid, transaction.id);

    // Convert Date to ISO string for Firebase storage
    const transactionData = {
        ...transaction,
        date: transaction.date.toISOString(),
    };

    try {
        await set(transactionRef, transactionData);
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw error;
    }
};

/**
 * Delete a transaction from Firebase
 */
export const deleteTransaction = async (transactionId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const transactionRef = getTransactionRef(user.uid, transactionId);

    try {
        await remove(transactionRef);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time updates of transactions
 */
export const subscribeToTransactions = (
    userId: string,
    callback: (transactions: Transaction[]) => void
): (() => void) => {
    const transactionsRef = getTransactionsRef(userId);

    const unsubscribe = onValue(
        transactionsRef,
        (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const transactions: Transaction[] = Object.values(data).map((t: any) => ({
                    ...t,
                    date: new Date(t.date),
                }));
                // Sort by date
                transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
                callback(transactions);
            } else {
                callback([]);
            }
        },
        (error) => {
            console.error('Error subscribing to transactions:', error);
            callback([]);
        }
    );

    // Return cleanup function
    return () => {
        off(transactionsRef);
    };
};

/**
 * Migrate data from localStorage to Firebase (one-time operation)
 */
export const migrateLocalStorageData = async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        // Check if there's data in localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            console.log('No localStorage data to migrate');
            return;
        }

        // Check if Firebase already has data
        const transactionsRef = getTransactionsRef(user.uid);
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
            console.log('Firebase already has data, skipping migration');
            // Clear localStorage anyway to avoid confusion
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        // Parse localStorage data
        const localTransactions = JSON.parse(stored);

        if (!Array.isArray(localTransactions) || localTransactions.length === 0) {
            console.log('No valid transactions to migrate');
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        // Migrate each transaction
        const migrationPromises = localTransactions.map((t: any) => {
            const transaction: Transaction = {
                ...t,
                date: new Date(t.date),
            };
            return saveTransaction(transaction);
        });

        await Promise.all(migrationPromises);

        // Clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
        console.log(`Successfully migrated ${localTransactions.length} transactions to Firebase`);
    } catch (error) {
        console.error('Error migrating localStorage data:', error);
        throw error;
    }
};
