
import SvgBackground  from '@/components/svgBackground';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
			<>
				<SvgBackground>
					<div className="flex justify-center items-center mx-auto h-screen">
						{children}
					</div>
				</SvgBackground>
			</>
		);
}