import React from 'react';
import type { ProductOption, ProductOptionChoice } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X, Layers, Sparkles } from 'lucide-react';

interface ProductOptionsBuilderProps {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export default function ProductOptionsBuilder({ options, onChange }: ProductOptionsBuilderProps) {
  // Add new empty group
  const handleAddGroup = (groupName = '') => {
    const newGroup: ProductOption = {
      name: groupName || `Option Group ${options.length + 1}`,
      choices: [
        { value: 'Standard', price_modifier: 0 }
      ],
    };
    onChange([...options, newGroup]);
  };

  // Preset quick adds
  const handleAddPreset = (presetType: 'size' | 'yogurt' | 'flavours' | 'toppings') => {
    if (presetType === 'size') {
      const sizeGroup: ProductOption = {
        name: 'Size',
        choices: [
          { value: 'Mini (330ml)', price_modifier: -2500 },
          { value: 'Medium (500ml)', price_modifier: 0 },
          { value: 'Gbemidele (550ml)', price_modifier: 1500 },
          { value: 'Ay Bowl (1L)', price_modifier: 6500 },
        ],
      };
      onChange([...options, sizeGroup]);
    } else if (presetType === 'yogurt') {
      const yogurtGroup: ProductOption = {
        name: 'Yogurt Type',
        choices: [
          { value: 'Sweetened', price_modifier: 0 },
          { value: 'Unsweetened', price_modifier: 0 },
        ],
      };
      onChange([...options, yogurtGroup]);
    } else if (presetType === 'flavours') {
      const flavourGroup: ProductOption = {
        name: 'Flavour',
        choices: [
          { value: 'Vanilla', price_modifier: 0 },
          { value: 'Strawberry', price_modifier: 0 },
          { value: 'Banana', price_modifier: 0 },
        ],
      };
      onChange([...options, flavourGroup]);
    } else if (presetType === 'toppings') {
      const toppingsGroup: ProductOption = {
        name: 'Toppings',
        choices: [
          { value: 'Extra Granola', price_modifier: 500 },
          { value: 'Cashew Nuts', price_modifier: 800 },
          { value: 'Chia Seeds', price_modifier: 500 },
        ],
      };
      onChange([...options, toppingsGroup]);
    }
  };

  // Update group name
  const handleGroupNameChange = (groupIndex: number, newName: string) => {
    const updated = options.map((grp, idx) => (idx === groupIndex ? { ...grp, name: newName } : grp));
    onChange(updated);
  };

  // Remove group
  const handleRemoveGroup = (groupIndex: number) => {
    const updated = options.filter((_, idx) => idx !== groupIndex);
    onChange(updated);
  };

  // Add choice to a group
  const handleAddChoice = (groupIndex: number) => {
    const updated = options.map((grp, idx) => {
      if (idx === groupIndex) {
        return {
          ...grp,
          choices: [...grp.choices, { value: '', price_modifier: 0 }],
        };
      }
      return grp;
    });
    onChange(updated);
  };

  // Update choice
  const handleChoiceChange = (
    groupIndex: number,
    choiceIndex: number,
    field: 'value' | 'price_modifier',
    val: any
  ) => {
    const updated = options.map((grp, gIdx) => {
      if (gIdx === groupIndex) {
        const newChoices = grp.choices.map((ch, cIdx) => {
          if (cIdx === choiceIndex) {
            return {
              ...ch,
              [field]: field === 'price_modifier' ? (val === '' ? undefined : Number(val)) : val,
            };
          }
          return ch;
        });
        return { ...grp, choices: newChoices };
      }
      return grp;
    });
    onChange(updated);
  };

  // Remove choice
  const handleRemoveChoice = (groupIndex: number, choiceIndex: number) => {
    const updated = options.map((grp, gIdx) => {
      if (gIdx === groupIndex) {
        return {
          ...grp,
          choices: grp.choices.filter((_, cIdx) => cIdx !== choiceIndex),
        };
      }
      return grp;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
        <div>
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Product Option Groups (Sizes, Yogurt Type, Add-ins)
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Allow customers to customize cup sizes, sweetness, or add-ons with automatic price adjustments.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => handleAddGroup('')}
          className="h-8 text-xs font-bold rounded-xl gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Option Group
        </Button>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Quick Presets:
        </span>
        <button
          type="button"
          onClick={() => handleAddPreset('size')}
          className="text-[11px] font-semibold bg-muted/60 hover:bg-muted hover:text-primary px-2.5 py-1 rounded-lg border border-border transition-colors"
        >
          + Size Options
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset('yogurt')}
          className="text-[11px] font-semibold bg-muted/60 hover:bg-muted hover:text-primary px-2.5 py-1 rounded-lg border border-border transition-colors"
        >
          + Yogurt Sweetness
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset('toppings')}
          className="text-[11px] font-semibold bg-muted/60 hover:bg-muted hover:text-primary px-2.5 py-1 rounded-lg border border-border transition-colors"
        >
          + Extra Toppings
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset('flavours')}
          className="text-[11px] font-semibold bg-muted/60 hover:bg-muted hover:text-primary px-2.5 py-1 rounded-lg border border-border transition-colors"
        >
          + Flavours
        </button>
      </div>

      {/* Option Groups List */}
      {options.length === 0 ? (
        <div className="p-5 rounded-2xl border border-dashed border-border bg-muted/20 text-center space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">No customization options configured.</p>
          <p className="text-[11px] text-muted-foreground">
            This product will be sold at its standard base price without variant selectors.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {options.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="p-4 rounded-2xl border border-border bg-muted/30 space-y-3 relative group"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md shrink-0">
                      Group {groupIndex + 1}
                    </span>
                    <Input
                      value={group.name}
                      onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
                      placeholder="e.g. Size, Yogurt Type, Flavour..."
                      className="h-8 rounded-lg bg-white text-xs font-bold"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveGroup(groupIndex)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                  title="Remove this entire option group"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Choices inside Group */}
              <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                  <span className="col-span-7">Choice Name / Variant</span>
                  <span className="col-span-4">Price Modifier (₦)</span>
                  <span className="col-span-1 text-right"></span>
                </div>

                {group.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-7">
                      <Input
                        value={choice.value}
                        onChange={(e) => handleChoiceChange(groupIndex, choiceIndex, 'value', e.target.value)}
                        placeholder="e.g. Medium (500ml)"
                        className="h-8 rounded-lg bg-white text-xs font-medium"
                      />
                    </div>

                    <div className="col-span-4">
                      <Input
                        type="number"
                        value={choice.price_modifier ?? ''}
                        onChange={(e) => handleChoiceChange(groupIndex, choiceIndex, 'price_modifier', e.target.value)}
                        placeholder="0 (e.g. +1500 or -2500)"
                        className="h-8 rounded-lg bg-white text-xs font-mono"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(groupIndex, choiceIndex)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove choice"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddChoice(groupIndex)}
                  className="h-7 text-[11px] font-bold rounded-lg gap-1 mt-1 bg-white text-primary border-primary/30 hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3" />
                  Add Choice / Size Value
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
