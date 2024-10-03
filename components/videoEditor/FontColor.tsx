import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';


interface FontColorProps {
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  strokeColor: string;
  setStrokeColor: React.Dispatch<React.SetStateAction<string>>;
  emphasizeColor: string;
  setEmphasizeColor: React.Dispatch<React.SetStateAction<string>>;
}

const FontColor: React.FC<FontColorProps> = ({
  textColor, setTextColor,
  strokeColor, setStrokeColor,
  emphasizeColor, setEmphasizeColor,
}) => {
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const textPickerRef = useRef<HTMLDivElement>(null);
  const strokePickerRef = useRef<HTMLDivElement>(null);
  const emphasizePickerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of color pickers to close them
  const handleClickOutside = (event: MouseEvent) => {
    if (
      textPickerRef.current && !textPickerRef.current.contains(event.target as Node) &&
      strokePickerRef.current && !strokePickerRef.current.contains(event.target as Node) &&
      emphasizePickerRef.current && !emphasizePickerRef.current.contains(event.target as Node)
    ) {
      setActivePicker(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(color);
  };

  // Reset color to default
  const clearColor = (setter: React.Dispatch<React.SetStateAction<string>>, defaultColor: string) => {
    setter(defaultColor);
  };

  return (
    <div className="flex flex-col">
      {/* First Section */}
      <div className="flex w-full flex-col gap-4">
        <div className="border-b border-b-neutral-800 flex items-center justify-between sticky">
          <div className="flex items-center">
            <p className="text-lg  font-semibold">{"Text"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Text Color */}
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Text Color"}</h2>
              <div className="space-y-2">
                <div
                  ref={textPickerRef}
                  className="flex w-min items-center space-x-2 rounded-md border px-2 pr-0 border-neutral-300 shadow-lg relative"
                >
                  <div
                    className="h-6 w-6 rounded-md border-2 border-gray-200 transition-all duration-200 hover:scale-105 dark:border-neutral-600 cursor-pointer"
                    style={{ backgroundColor: `${textColor}` }}
                    onClick={() => setActivePicker(activePicker === 'text' ? null : 'text')}
                  ></div>
                  {activePicker === 'text' && (
                    <div className="absolute z-10 mt-2 top-full p-1 left-0 border border-gray-300 rounded-lg shadow-2xl bg-neutral-200">
                      <HexColorPicker
                        color={textColor}
                        onChange={(color) => handleColorChange(color, setTextColor)}
                      />
                      <button
                        className="w-full text-sm px-4 py-2 bg-transparent border-t border-gray-300 text-red-500 hover:text-red-600 focus:outline-none"
                        onClick={() => clearColor(setTextColor, '#ffffff')}
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">{"✖"}</span> {"Clear Color"}
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="flex">
                    <div className="flex items-center gap-1 rounded-md p-2 transition-colors text-sm duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                      <input
                        className="w-16 bg-transparent focus:outline-none"
                        spellCheck="false"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Stroke Color */}
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Stroke Color"}</h2>
              <div className="space-y-2">
                <div
                  ref={strokePickerRef}
                  className="flex w-min items-center space-x-2 rounded-md border px-2 pr-0 border-neutral-300 shadow-lg  relative"
                >
                  <div
                    className="h-6 w-6 rounded-md border-2 border-gray-200 transition-all duration-200 hover:scale-105 dark:border-neutral-600 cursor-pointer"
                    style={{ backgroundColor: `${strokeColor}` }}
                    onClick={() => setActivePicker(activePicker === 'stroke' ? null : 'stroke')}
                  ></div>
                  {activePicker === 'stroke' && (
                    <div className="absolute z-10 mt-2 top-full p-1 left-0 border border-gray-300 rounded-lg shadow-2xl bg-neutral-200">
                      <HexColorPicker
                        color={strokeColor}
                        onChange={(color) => handleColorChange(color, setStrokeColor)}
                      />
                      <button
                        className="w-full text-sm px-4 py-2 bg-transparent border-t border-gray-300 text-red-500 hover:text-red-600 focus:outline-none"
                        onClick={() => clearColor(setStrokeColor, "#1CFFDD")}
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">{"✖"}</span> {"Clear Color"}
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="flex">
                    <div className="flex items-center gap-1 rounded-md p-2 transition-colors text-sm duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                      <input
                        className="w-16 bg-transparent focus:outline-none"
                        spellCheck="false"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="flex w-full flex-col gap-4 pb-4">
        <div className="border-b border-b-neutral-800 py-1 pt-3 flex items-center justify-between sticky -top-2 ">
          <div className="flex items-center gap-2">
            <p className="text-lg  font-semibold">{"Animation Colors"}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Active Word Color"}</h2>
              <div className="space-y-2">
                <div
                  ref={emphasizePickerRef}
                  className="flex w-min items-center space-x-2 rounded-md border px-2 pr-0 border-neutral-300 shadow-lg relative"
                >
                  <div
                    className="h-6 w-6 rounded-md border-2 border-gray-200 transition-all duration-200 hover:scale-105 dark:border-neutral-600 cursor-pointer"
                    style={{ backgroundColor: `${emphasizeColor}` }}
                    onClick={() => setActivePicker(activePicker === 'emphasize' ? null : 'emphasize')}
                  ></div>
                  {activePicker === 'emphasize' && (
                    <div className="absolute z-10 mt-2 top-full p-1 left-0 border border-gray-300 rounded-lg shadow-2xl bg-neutral-200">
                      <HexColorPicker
                        color={emphasizeColor}
                        onChange={(color) => handleColorChange(color, setEmphasizeColor)}
                      />
                      <button
                        className="w-full text-sm px-4 py-2 bg-transparent border-t border-gray-300 text-red-500 hover:text-red-600 focus:outline-none"
                        onClick={() => clearColor(setEmphasizeColor, '#0094ff')}
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">{"✖"}</span> {"Clear Color"}
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="flex">
                    <div className="flex items-center gap-1 rounded-md p-2 transition-colors text-sm duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                      <input
                        className="w-16 bg-transparent focus:outline-none"
                        spellCheck="false"
                        value={emphasizeColor}
                        onChange={(e) => setEmphasizeColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontColor;