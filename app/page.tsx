// app/page.tsx

import { redirect } from 'next/navigation';
import React from 'react';

// This component is the default page for the root route (/).
export default function RootPage() {
    // 🗺️ Redirect the user from the root URL (/) to the /map route.
    redirect('/map');

    // The redirect function throws an error, so this return statement is technically
    // unreachable but helps satisfy React component structure rules.
    return null;
}