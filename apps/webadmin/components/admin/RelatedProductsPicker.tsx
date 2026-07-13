"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/core";
import type { NewsRelatedProduct } from "@webclient/lib/cms/news-types";

type ProductOption = { id: string; name: string };

export function RelatedProductsPicker({
  value,
  onChange,
  cars,
  scooters,
  accessories,
}: {
  value: NewsRelatedProduct[];
  onChange: (next: NewsRelatedProduct[]) => void;
  cars: ProductOption[];
  scooters: ProductOption[];
  accessories: ProductOption[];
}) {
  const add = () => onChange([...value, { type: "car", id: cars[0]?.id ?? "" }]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<NewsRelatedProduct>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const optionsFor = (type: NewsRelatedProduct["type"]) => {
    if (type === "car") return cars;
    if (type === "scooter") return scooters;
    return accessories;
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={`${item.type}-${item.id}-${index}`} className="flex flex-wrap items-center gap-2">
          <select
            value={item.type}
            onChange={(e) =>
              update(index, {
                type: e.target.value as NewsRelatedProduct["type"],
                id: optionsFor(e.target.value as NewsRelatedProduct["type"])[0]?.id ?? "",
              })
            }
            className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="car">Ô tô</option>
            <option value="scooter">Xe máy điện</option>
            <option value="accessory">Phụ kiện</option>
          </select>
          <select
            value={item.id}
            onChange={(e) => update(index, { id: e.target.value })}
            className="h-9 min-w-[220px] flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            {optionsFor(item.type).map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Thêm sản phẩm liên quan
      </Button>
    </div>
  );
}
