export async function triggerRevalidation(tag: string) {
	const baseUrl = process.env.ADMIN_APP_BASE_URL;
	const secret = process.env.REVALIDATION_SECRET;

	if (!baseUrl) {
		console.error(
			"ADMIN_APP_BASE_URL environment variable is not set. Cannot trigger revalidation."
		);
		return;
	}
	if (!secret) {
		console.error(
			"REVALIDATION_SECRET environment variable is not set. Cannot trigger revalidation."
		);
		return;
	}

	const revalidationUrl = `${baseUrl}/api/revalidate?tag=${tag}&secret=${secret}`;

	console.log(
		`Sending revalidation request for tag: ${tag} to ${revalidationUrl}`
	);

	try {
		// Fetch using the absolute URL
		const revalRes = await fetch(revalidationUrl, { method: "GET" });

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
}
