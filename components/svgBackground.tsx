import React, { ReactNode } from "react";

interface SvgBackgroundProps {
	children: ReactNode;
}

const SvgBackground: React.FC<SvgBackgroundProps> = ({ children }) => {
	const svgString = `
 <svg xmlns='http://www.w3.org/2000/svg'  width='1600' height='900' viewBox='0 0 1600 900'><rect fill='#ffffff' width='1600' height='900'/><defs><linearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'><stop  offset='0' stop-color='#728160'/><stop  offset='1' stop-color='#c3d4af'/></linearGradient><linearGradient id='b' gradientUnits='userSpaceOnUse' x1='85' y1='86' x2='268' y2='160'><stop  offset='0' stop-color='#868686'/><stop  offset='0.09' stop-color='#ababab'/><stop  offset='0.18' stop-color='#c4c4c4'/><stop  offset='0.31' stop-color='#d7d7d7'/><stop  offset='0.44' stop-color='#e5e5e5'/><stop  offset='0.59' stop-color='#f1f1f1'/><stop  offset='0.75' stop-color='#f9f9f9'/><stop  offset='1' stop-color='#FFFFFF'/></linearGradient><filter id='c' x='0' y='0' width='200%' height='200%'><feGaussianBlur in='SourceGraphic' stdDeviation='12' /></filter></defs><polygon fill='url(#a)' points='0 174 0 0 174 0'/><path fill='#000' fill-opacity='0.42' filter='url(#c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z'/><path fill='url(#b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z'/></svg>
  `;

	return (
		<div
			style={{
				background: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
					svgString
				)}")`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				width: "100%",
				height: "100vh",
			}}
		>
			{children}
		</div>
	);
};

export default SvgBackground;
