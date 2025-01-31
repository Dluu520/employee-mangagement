"use client";

import { useEffect, useState } from "react";
// Base API URLs for various requests
const baseUrl = "https://jsonplaceholder.typicode.com";
interface Post {
  id: number;
  title: string;
}
// This component fetches and displays a list of todos
export default function Todos() {
  const [todos, setTodos] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [posts, setPost] = useState<Post[]>([]);

  // Fetch the todo items
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/todos`);
        const data = (await response.json()) as Post[];
        setTodos(data);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <div>Todo List</div>
      {isLoading ? (
        <div className="flex h-screen p-20">loading data....</div>
      ) : (
        <ul className="h-full w-full overflow-scroll list-disc pl-5 border border-black ">
          {todos.map(post => {
            return (
              <li className="" key={post.id}>
                {post.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
