import React from "react";

export default function PublicLayout({ children }: { children : React.ReactNode}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4 text-center">NavBar</header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-800 text-white p-4 text-center">Footer</footer>
        </div>
        );
}