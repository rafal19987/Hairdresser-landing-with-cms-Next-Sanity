export const SectionWrapper: React.FC<{
  children?: React.ReactNode;
  sectionId?: string;
}> = ({ children, sectionId }) => {
  return (
    <section id={sectionId} className={`relative`}>
      <div className={`lg:pt-32' pb-12 pt-24 lg:pb-24`}>{children}</div>
    </section>
  );
};
