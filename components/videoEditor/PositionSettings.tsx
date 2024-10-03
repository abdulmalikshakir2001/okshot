import React from 'react';
import { useTranslation } from 'next-i18next';
interface Position {
  xPosition: string;
  setXPosition: React.Dispatch<React.SetStateAction<string>>;
  yPosition: string; 
  setYPosition: React.Dispatch<React.SetStateAction<string>>;
  rotation: string;
  setRotation: React.Dispatch<React.SetStateAction<string>>;
  scale: string;
  setScale: React.Dispatch<React.SetStateAction<string>>;
}

const PositionSettings: React.FC<Position> = ({
  xPosition, setXPosition,
  yPosition, setYPosition,
  rotation, setRotation,
  scale, setScale,
}) => {
  const { t } = useTranslation('common');
  return (
    <div className="h-full overflow-y-auto px-4 pt-2 pb-12">
      <div className="flex flex-col gap-4 pb-8">
        <div className="flex w-full flex-col gap-4 pb-4">
          <div className="border-b border-b-neutral-800 py-2 flex items-center justify-between sticky -top-2 ">
            <div className="flex items-center">
              <p className="text-lg font-semibold">{t("Position")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{t("x-position")}</h2>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex h-fit w-fit items-center gap-1 rounded-md border border-neutral-300 shadow-lg text-xs">
                  <div className="inline-block">
                    <div className="w-full rounded-md">
                      <input
                        className="w-full rounded-md border  focus:ring-0 focus-visible:outline-0  placeholder:text-neutral-400 border-neutral-300 active:border-neutral-500 focus:border-neutral-500  text-base px-2 py-2 bg-transparentoutline-none hover:bg-neutral-200 transition-colors duration-200"
                        type="number"
                        step="1"
                        value={xPosition}
                        onChange={(e) => setXPosition(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="px-1 dark:text-neutral-500">{t("px")}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{t("y-position")}</h2>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex h-fit w-fit items-center gap-1 rounded-md border border-neutral-300 shadow-lg text-xs">
                  <div className="inline-block">
                    <div className="w-full rounded-md">
                      <input
                        className="w-full rounded-md border focus:ring-0 focus-visible:outline-0  placeholder:text-neutral-400 border-neutral-300 active:border-neutral-400 focus:border-neutral-400  text-base px-2 py-2 bg-transparent outline-none hover:bg-neutral-200 transition-colors duration-200 text-[10px]"
                        type="number"
                        step="1"
                        value={yPosition}
                        onChange={(e) => setYPosition(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="px-1 dark:text-neutral-500">{t("px")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
          <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{t("Rotation")}</h2>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex h-fit w-fit items-center gap-1 rounded-md border border-neutral-300 shadow-lg text-xs">
                  <div className="inline-block">
                    <div className="w-full rounded-md">
                      <input
                        className="w-full rounded-md border focus:ring-0 focus-visible:outline-0  placeholder:text-neutral-400 border-neutral-300 active:border-neutral-500 focus:border-neutral-400  text-base px-2 py-2 bg-transparent outline-none hover:bg-neutral-200 transition-colors duration-200"
                        type="number"
                        step="1"
                        value={rotation}
                        onChange={(e) => setRotation(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="px-1 dark:text-neutral-500">º</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{t("Scale")}</h2>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex h-fit w-fit items-center gap-1 rounded-md border border-neutral-300 shadow-lg text-xs">
                  <div className="inline-block">
                    <div className="w-full rounded-md">
                      <input
                        className="w-full rounded-md border  focus:ring-0 focus-visible:outline-0  placeholder:text-neutral-400 border-neutral-300 active:border-neutral-500 focus:border-neutral-500 text-base px-2 py-2 bg-transparent outline-none hover:bg-neutral-300 transition-colors duration-200 "
                        type="number"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
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



export default PositionSettings;
