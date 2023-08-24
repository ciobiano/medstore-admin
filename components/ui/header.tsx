interface HeadingProps {
	title: string;
	description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
	return (
		<div>
			<h2 className="font-bold text-3xl ">{title}</h2>
			<p className="text-sm color-muted-foreground">{description}</p>
		</div>
	);
};

export default Heading;
