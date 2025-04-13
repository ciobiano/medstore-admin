import { revalidateTag } from "next/cache"; // Import if calling revalidateTag directly from backend

export async function triggerRevalidation(tag: string) {
	// Construct the URL to your revalidation endpoint
	// Ensure this URL correctly points to your running medstore-admin app's API
	const revalidationUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/revalidate?tag=${tag}&secret=${process.env.REVALIDATION_SECRET}`;

	console.log(
		`Sending revalidation request for tag: ${tag} to ${revalidationUrl}`
	); 

	try {
		const revalRes = await fetch(revalidationUrl);
		if (!revalRes.ok) {
			console.error(
				`Revalidation request failed for tag "${tag}": ${
					revalRes.status
				} ${await revalRes.text()}`
			);
		} else {
			const result = await revalRes.json();
			console.log(`Revalidation request successful for tag "${tag}":`, result);
		}
	} catch (err) {
		console.error(`Failed to send revalidation request for tag "${tag}":`, err);
	}

	/* 
        // Alternative (If revalidating within the SAME app instance, less common for separate admin/frontend):
        // You could potentially call revalidateTag directly here,
        // BUT that only works if the code triggering the revalidation 
        // runs in the SAME Next.js instance as the frontend app whose cache needs clearing.
        // Calling your own API endpoint is generally safer for separate apps.
        try {
            revalidateTag(tag);
            console.log(`Revalidated tag "${tag}" directly.`);
        } catch (err) {
            console.error(`Failed to revalidate tag "${tag}" directly:`, err);
        }
        */
}
