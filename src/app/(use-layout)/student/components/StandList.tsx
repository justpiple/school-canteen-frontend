import { Stand } from "@/types/Menu";
import { Button } from "@/components/ui/button";

interface StandListProps {
  stands: Stand[];
  selectedStand: Stand | null;
  onSelectStand: (stand: Stand) => void;
}

export function StandList({
  stands,
  selectedStand,
  onSelectStand,
}: Readonly<StandListProps>) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Select a Stand</h2>
      <div className="flex flex-wrap gap-2">
        {stands.map((stand) => (
          <Button
            key={stand.id}
            variant={selectedStand?.id === stand.id ? "default" : "outline"}
            onClick={() => onSelectStand(stand)}
          >
            {stand.standName}
          </Button>
        ))}
      </div>
    </div>
  );
}
