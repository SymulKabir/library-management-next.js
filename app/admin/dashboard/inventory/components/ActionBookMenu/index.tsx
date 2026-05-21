"use client"
import React, { useState } from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import './styles.scss'
import { promiseToast } from '@/shared/utils/toast';

const ActionBookMenu = ({ book_id, setBooks }: { book_id: string, setBooks: (fn: any) => void }) => {
    const [processing, setProcessing] = useState<{ delete: boolean }>({ delete: false });
    const router = useRouter()

    const handleEdit = () => router.push(`/admin/dashboard/inventory/edit/${book_id}`);
    const apiCall = async () => {
        try {
            setProcessing((state) => {
                return {
                    ...state,
                    signup: true,
                };
            });
            const response = await fetch("/api/books/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_id }),
            });

            const { success, message } = await response.json();
            if (!success) {
                throw new Error(message || `Failed to delete book`);
            }
            setBooks((books: any[]) => books.filter(book => book.book_id !== book_id));
            return null;
        } catch (error) {
            throw new Error(error.message || "Signup failed")
        } finally {
            setProcessing((state) => {
                return {
                    ...state,
                    signup: false,
                };
            });
        }
    };

    const delete_book = async () => {
        if (processing.delete) return;

        try {
            const result = await promiseToast(apiCall(), {
                pending: `Book number ${book_id} deleting...`,
                success: {
                    render: ({ data }: { data: any }) => {
                        return `Book number ${book_id} deleted successfully!`
                    }
                },
                error: {
                    render: ({ data }: { data: { message: string } }) => `${data.message}`
                }
            });

        } catch (err) {
            console.error("Signup error:", err);
        }
    };


    return (
        <div className='action-book-menu'>
            <button onClick={handleEdit}><RiEdit2Line /> Edit</button>
            <button onClick={delete_book}><RiDeleteBin5Line /> Delete</button>
        </div>
    )
}

export default ActionBookMenu