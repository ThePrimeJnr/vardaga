import { Reference } from "../types";
import LinkPreviewCard from "./LinkPreviewCard";

interface ReferencesProps {
  references: Reference[];
}

const References = ({ references }: ReferencesProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {references.map((ref, index) => (
        <LinkPreviewCard
          key={index}
          url={ref.url}
          title={ref.title}
          description={ref.description}
          image={ref.image}
        />
      ))}
    </div>
  );
};

export default References;
