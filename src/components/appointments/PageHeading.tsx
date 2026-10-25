export const PageHeading: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div className="prose mb-8 max-w-none prose-headings:text-white prose-p:text-[#BEBEBE]">
    <h1 className="font-exo text-5xl font-black lg:text-6xl">{title}</h1>
    <p className="font-robotoCondensed text-xl">{description}</p>
  </div>
);
