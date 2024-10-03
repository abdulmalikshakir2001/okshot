import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaPaintBrush } from 'react-icons/fa';
import { PiTextAlignCenter, PiTextAlignLeft, PiTextAlignRight, PiTextTBold } from 'react-icons/pi';
import { SlEnergy } from 'react-icons/sl';
import FontColor from './FontColor'
import PositionSettings from './PositionSettings';

interface FontStyle {
    id: number;
    fontSize: string;
    color: string;
    highlightColor: string;
    fontFamily: string;
    borderRadius: string;
    padding: string;
    fontWeight: number;
    textShadow?: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right'; 
    textTransform: 'none' | "capitalize" | 'uppercase' | 'lowercase';
    letterSpacing: string;
    xPosition: string; 
    yPosition: string; 
    rotation: string; 
    scale: string; 
}

const fontStyles: Record<string, FontStyle> = {
    font1: {
        id: 1,
        fontSize: "16px",
        color: "#FFFFFF",
        highlightColor: '#0000FF',
        fontFamily: "Montserrat",
        borderRadius: '0.375rem',
        padding: '0.5rem 0.5rem',
        fontWeight: 800,
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow:
            `#1CFFDD 6px 0px 5px, 
            #1CFFDD 5px 1px 5px, 
            #1CFFDD 4px 3px 5px, 
            #1CFFDD 3px 5px 5px, 
            #1CFFDD 2px 6px 5px, 
            #1CFFDD 1px 7px 5px, 
            #1CFFDD 0px 7px 5px, 
            #1CFFDD -1px 7px 5px, 
            #1CFFDD -2px 6px 5px, 
            #1CFFDD -3px 4px 5px, 
            #1CFFDD -4px 3px 5px, 
            #1CFFDD -5px 1px 5px, 
            #1CFFDD -4px -1px 5px, 
            #1CFFDD -3px -3px 5px, 
            #1CFFDD -2px -5px 5px, 
            #1CFFDD -1px -6px 5px, 
            #1CFFDD 0px -7px 5px, 
            #1CFFDD 1px -6px 5px, 
            #1CFFDD 2px -4px 5px, 
            #1CFFDD 3px -3px 5px, 
            #1CFFDD 4px -1px 5px`,
        backgroundColor: " ",
    },
    font2: {
        id: 2,
        fontSize: "16px",
        color: "#FFFFFF",
        highlightColor: '#0000FF',
        fontFamily: "Montserrat",
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 800,
        backgroundColor: " ",
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow:
    `#000000 6px 0px 4px, 
    #000000 5px 2px 4px, 
    #000000 4px 4px 4px, 
    #000000 3px 6px 4px, 
    #000000 2px 8px 4px, 
    #000000 1px 10px 4px, 
    #000000 0px 12px 4px, 
    #000000 -1px 10px 4px, 
    #000000 -2px 8px 4px, 
    #000000 -3px 6px 4px,
    #000000 -4px 4px 4px, 
    #000000 -5px 2px 4px, 
    #000000 -6px 0px 4px, 
    #000000 -5px -2px 4px, 
    #000000 -4px -4px 4px, 
    #000000 -3px -6px 4px, 
    #000000 -2px -8px 4px, 
    #000000 -1px -10px 4px, 
    #000000 0px -12px 4px, 
    #000000 1px -10px 4px, 
    #000000 2px -8px 4px, 
    #000000 3px -6px 4px, 
    #000000 4px -4px 4px, 
    #000000 5px -2px 4px`
    },
    font3: {
        id: 3,
        fontSize: "16px",
        color: "#FFFFFF",
        highlightColor: '#0000FF',
        fontFamily: "Montserrat",
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 800,
        backgroundColor: '',
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow:
            `#000000 4px 0px 0px, 
            #000000 3px 1px 0px, 
            #000000 2px 3px 0px, 
            #000000 1px 4px 0px, 
            #000000 0px 4px 0px, 
            #000000 -1px 4px 0px, 
            #000000 -2px 3px 0px, 
            #000000 -3px 2px 0px, 
            #000000 -4px 1px 0px, 
            #000000 -4px 0px 0px, 
            #000000 -4px -1px 0px, 
            #000000 -3px -2px 0px, 
            #000000 -2px -3px 0px, 
            #000000 -1px -4px 0px, 
            #000000 0px -4px 0px, 
            #000000 1px -4px 0px, 
            #000000 2px -3px 0px,
            #000000 3px -2px 0px`,
    },
    font4: {
        id: 4,
        fontSize: "16px",
        color: "#FFFFFF",
        highlightColor: '#0000FF',
        fontFamily: "Pacifico",
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 800,
        backgroundColor: '',
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow: `
        #000000 4px 0px 0px,
        #000000 4px 1px 0px,
        #000000 3px 1px 0px,
        #000000 3px 2px 0px,
        #000000 3px 3px 0px,
        #000000 2px 3px 0px,
        #000000 1px 3px 0px,
        #000000 0px 4px 0px,
        #000000 -1px 4px 0px,
        #000000 -2px 3px 0px,
        #000000 -3px 2px 0px,
        #000000 -4px 1px 0px,
        #000000 -4px 0px 0px,
        #000000 -4px -1px 0px,
        #000000 -3px -1px 0px,
        #000000 -3px -2px 0px,
        #000000 -3px -3px 0px,
        #000000 -2px -3px 0px,
        #000000 -1px -3px 0px,
        #000000 0px -4px 0px,
        #000000 1px -4px 0px,
        #000000 2px -3px 0px,
        #000000 3px -3px 0px,
        #000000 4px -1px 0px,
        #000000 4px 0px 0px
      `,
    },
    font5: {
        id: 5,
        fontSize: "16px",
        color: "#000000",
        highlightColor: '#0000FF',
        fontFamily: "Permanent Marker", // Comic Sans MS, Eras Bold ITC, Forte, Lucida Handwriting, Script MT Bold
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 800,
        backgroundColor: '',
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow: `
        #FFFFFF 2px 0px 0px,
        #FFFFFF 2px 1px 0px,
        #FFFFFF 1px 1px 0px,
        #FFFFFF 1px 2px 0px,
        #FFFFFF 0px 2px 0px,
        #FFFFFF -1px 2px 0px,
        #FFFFFF -1px 1px 0px,
        #FFFFFF -2px 1px 0px,
        #FFFFFF -2px 0px 0px,
        #FFFFFF -2px -1px 0px,
        #FFFFFF -1px -1px 0px,
        #FFFFFF -1px -2px 0px,
        #FFFFFF 0px -2px 0px,
        #FFFFFF 1px -2px 0px,
        #FFFFFF 2px -1px 0px,
        #FFFFFF 2px 0px 0px
      `,
    },
    font6: {
        id: 6,
        fontSize: "16px",
        color: "#FFFFFF",
        highlightColor: '#0000FF',
        fontFamily: "Cinzel",
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 800,
        backgroundColor: 'none',
        textAlign: 'center',
        textTransform: 'none',
        letterSpacing: '1.5',
        xPosition: "10", // Default position
        yPosition: "-30", // Default position
        rotation: "-5", // Default rotation
        scale: "1", // Default scale
        textShadow: `
        #000000 3px 0px 0px,
        #000000 2px 0px 0px,
        #000000 2px 1px 0px,
        #000000 2px 2px 0px,
        #000000 1px 2px 0px,
        #000000 0px 2px 0px,
        #000000 -1px 2px 0px,
        #000000 -2px 2px 0px,
        #000000 -2px 1px 0px,
        #000000 -2px 0px 0px,
        #000000 -2px -1px 0px,
        #000000 -2px -2px 0px,
        #000000 -1px -2px 0px,
        #000000 0px -2px 0px,
        #000000 1px -2px 0px,
        #000000 2px -2px 0px,
        #000000 2px -1px 0px,
        #000000 2px 0px 0px
      `,
    },
};

interface SubtitleEditorProps {
    fontStyle: FontStyle;
    onFontStyleChange: (newFontStyle: FontStyle) => void;
}

const fontFamily: { [key: string]: string } = {
    "Arial": "Arial",
    "Ubuntu": "Ubuntu",
    "Sniglet": "Sniglet",
    "Roboto": "Roboto",
    "Permanent Marker": "Permanent Marker",
    "Pacifico": "Pacifico",
    "New Amsterdam": "New Amsterdam",
    "Nerko One": "Nerko One",
    "Montserrat": "Montserrat",
    "Jersey 10": "Jersey 10",
    "Cinzel": "Cinzel",
}


const SubtitleEditor: React.FC<SubtitleEditorProps> = ({ fontStyle, onFontStyleChange }) => {
    const [activeTab, setActiveTab] = useState<string>('presets'); // State to track the active tab
    const [selectedFont, setSelectedFont] = useState<string>(fontStyle.fontFamily);
    const [letterSpacing, setletterSpacing] = useState<string>("#");
    const [textColor, setTextColor] = useState<string>(fontStyle.color);
    const [strokeColor, setStrokeColor] = useState<string>('#1CFFDD');
    const [emphasizeColor, setEmphasizeColor] = useState<string>(fontStyle.highlightColor);
    const [xPosition, setXPosition] = useState<string>(fontStyle.xPosition);
    const [yPosition, setYPosition] = useState<string>(fontStyle.yPosition);
    const [rotation, setRotation] = useState<string>(fontStyle.rotation);
    const [scale, setScale] = useState<string>(fontStyle.scale);

    // Utility function to update the textShadow color
    const updateTextShadowColor = (shadowString: string, newColor: string) => {
        // Regular expression to match color in textShadow
        return shadowString.replace(/#([0-9A-F]{6}|[0-9A-F]{3})/gi, newColor);
    };

    useEffect(() => {
         // Update textShadow based on strokeColor
         const newTextShadow = updateTextShadowColor(fontStyle.textShadow || '', strokeColor);

        // Update font style based on new textColor and backgroundColor
        const updatedFontStyle: FontStyle = {
            ...fontStyle,
            color: textColor,
            xPosition: xPosition,
            yPosition: yPosition,
            rotation: rotation,
            scale: scale,
            highlightColor: emphasizeColor,
            textShadow: newTextShadow,
        };
        onFontStyleChange(updatedFontStyle);
    }, [textColor, xPosition, yPosition, rotation, scale, strokeColor, emphasizeColor]);

    // Function to handle tab clicks
    const handleTabClick = (tab: string) => {
        setActiveTab(tab === activeTab ? '' : tab); // Toggle the active tab
    };

    const handleChangeFontStyle = (styleKey: string) => {
        const newFontStyle = fontStyles[styleKey];
        if (newFontStyle) {
            onFontStyleChange(newFontStyle);
        }
        setTextColor(fontStyle.color);
    };

    const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFontFamily = e.target.value;
        const updatedFontStyle: FontStyle = {
            ...fontStyle,
            fontFamily: newFontFamily
        };
        setSelectedFont(newFontFamily);
        onFontStyleChange(updatedFontStyle);
    };

    const handleTextAlignChange = (alignment: 'left' | 'center' | 'right') => {
        const updatedFontStyle: FontStyle = {
            ...fontStyle,
            textAlign: alignment
        };
        onFontStyleChange(updatedFontStyle);
    };

    const handleTextTransformChange = (transform: 'none' | 'capitalize' | 'uppercase' | 'lowercase') => {
        const updatedFontStyle: FontStyle = {
            ...fontStyle,
            textTransform: transform
        };
        onFontStyleChange(updatedFontStyle);
    };

    const handleletterSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newletterSpacing = e.target.value;
        const updatedFontStyle: FontStyle = {
            ...fontStyle,
            letterSpacing: newletterSpacing
        };
        setletterSpacing(newletterSpacing);
        onFontStyleChange(updatedFontStyle);
    };



    return (
        <>
            <div className="flex flex-col w-[400px] h-[400px] border-2">
                <div className="flex gap-4 border-b-2">
                    <button
                        onClick={() => handleTabClick('presets')}
                        className={`p-2 flex items-center gap-2 ${activeTab === 'presets' ? "border-b-2 border-gray-900 text-black"
                            : "border-none text-gray-700"
                            } `}
                    >
                        <SlEnergy /> {"Presets"}
                    </button>
                    <button
                        onClick={() => handleTabClick('text')}
                        className={` p-2 flex gap-2 items-center ${activeTab === 'text' ? "border-b-2 border-gray-900 text-black"
                            : "border-none text-gray-700"
                            } `}
                    >
                        <PiTextTBold /> {"Text"}
                    </button>
                    <button
                        onClick={() => handleTabClick('color')}
                        className={`p-2 flex gap-2 items-center ${activeTab === 'color' ? "border-b-2 border-gray-900 text-black"
                            : "border-none text-gray-700"
                            } `}
                    >
                        <FaPaintBrush /> {"color"}
                    </button>
                    <button
                        onClick={() => handleTabClick('dots')}
                        className={`p-2 flex gap-2 items-center ${activeTab === 'dots' ? "border-b-2 border-gray-900 text-black"
                            : "border-none text-gray-700"
                            } `}
                    >
                        <BsThreeDots />
                    </button>
                </div>

                <div className="">
                    {/* presets font styles */}
                    {activeTab === 'presets' && (
                        <div className="pt-4 grid m-auto grid-cols-2 gap-4 w-[300px]">
                            {/* 1 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font1")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 font-extrabold w-fit select-none"
                                        style={{ 
                                            fontSize: `${fontStyles.font1.fontSize}`, 
                                            fontFamily: `${fontStyles.font1.fontFamily}`, 
                                            color: `${fontStyles.font1.color}`,
                                            fontWeight: `${fontStyles.font1.fontWeight}`, 
                                            letterSpacing: `${fontStyles.font1.letterSpacing}`, 
                                            textAlign: `${fontStyles.font1.textAlign}`, 
                                            textTransform: `${fontStyles.font1.textTransform}`, 
                                            padding: `${fontStyles.font1.padding}`
                                           }}
                                    >
                                        {"Your"} <span style={{textShadow: `${fontStyles.font1.textShadow}`, color: `${fontStyle.highlightColor}` }}>{"Brand"}</span>
                                    </p>
                                </div>
                            </div>

                            {/* 2 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font2")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 w-fit font-extrabold select-none"
                                        style={{ 
                                            fontSize: `${fontStyles.font1.fontSize}`, 
                                            fontFamily: `${fontStyles.font1.fontFamily}`, 
                                            color: `${fontStyles.font1.color}`, 
                                            fontWeight: `${fontStyles.font1.fontWeight}`, 
                                            letterSpacing: `${fontStyles.font1.letterSpacing}`, 
                                            textAlign: `${fontStyles.font1.textAlign}`, 
                                            textTransform: `${fontStyles.font1.textTransform}`, 
                                            padding: `${fontStyles.font1.padding}`
                                           }}
                                    >
                                        {"Sample"}{" "}
                                        <span style={{textShadow: `${fontStyles.font2.textShadow}`, color: `${fontStyle.highlightColor}` }}>{"Title"}</span>
                                    </p>
                                </div>
                            </div>

                            {/* 3 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font3")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 w-fit font-extrabold select-none"
                                        style={fontStyles.font3}
                                    >
                                        {"Sample"}{" "}
                                        <span style={{ color: "rgb(0, 148, 255)" }}>{"Title"}</span>
                                    </p>
                                </div>
                            </div>

                            {/* 4 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font4")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 font-bold w-fit select-none"
                                        style={fontStyles.font4}
                                    >
                                        {"Sample"}{" "}
                                        <span style={{ color: "rgb(0, 148, 255)" }}>{"Title"}</span>
                                    </p>
                                </div>
                            </div>

                            {/* 5 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font5")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 w-fit select-none"
                                        style={fontStyles.font5}
                                    >
                                        {"Sample"}{" "}
                                        <span style={{ color: `${fontStyle.highlightColor}` }}>{"Title"}</span>
                                    </p>
                                </div>
                            </div>

                            {/* 6 */}
                            <div className="p-4 bg-neutral-800 rounded-lg w-full cursor-pointer hover:scale-105 transition-all duration-100"
                                onClick={() => handleChangeFontStyle("font6")}>
                                <div>
                                    <p
                                        className="rounded-md px-4 py-2 w-fit select-none"
                                        style={fontStyles.font6}
                                    >
                                        {"Sample"}{" "}
                                        <span style={{ color: `${fontStyle.highlightColor}` }}>{"Title"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
            {/* ======= text editing settings ======= */}
                    {activeTab === 'text' && (
                        <div className="pt-4 w-[300px] m-auto">
                            <div className="flex justify-center items-center  flex-col gap-4 pb-4">
                                <div className="flex items-center gap-4">
                                    {/* Font Selection */}
                                    <div>
                                        <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Font"}</h2>
                                        <div className="inline-block text-left space-y-2">
                                            <select
                                                value={selectedFont}
                                                onChange={handleFontFamilyChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            >
                                                {Object.keys(fontFamily).map((font) => (
                                                    <option key={font} value={fontFamily[font]}>
                                                        {font}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Align Options */}
                                    <div>
                                        <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Align"}</h2>
                                        <div className="flex w-min grow-0 h-min rounded-md border border-neutral-300">
                                            <div className="rounded-l-md px-2 py-3 hover:cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 "
                                                onClick={() => handleTextAlignChange('left')}>
                                                <PiTextAlignLeft />
                                            </div>
                                            <div className="p-2 hover:cursor-pointer px-2 py-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 "
                                                onClick={() => handleTextAlignChange('center')}>
                                                <PiTextAlignCenter />
                                            </div>
                                            <div className="rounded-r-md p-2 hover:cursor-pointer px-2 py-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 dark:bg-neutral-900"
                                                onClick={() => handleTextAlignChange('right')}>
                                                <PiTextAlignRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-end">

                                    {/* Case Options */}
                                    <div>
                                        <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Case"}</h2>
                                        <div className="flex w-min border border-neutral-300 rounded-md">
                                            <div className="group relative inline-flex items-center justify-center">
                                                <div className="absolute z-50 m-2 hidden h-min w-max max-w-[11rem] rounded-md bg-black py-2 px-2 group-hover:block border border-neutral-700 bottom-full">
                                                    <p className="m-0 text-center text-xs text-white">{"Normal"}</p>
                                                    <div className="absolute top-full left-[45%] h-0 w-0 [border:_6px_solid_transparent] [border-top:_6px_solid_black]" />
                                                </div>
                                                <div className="p-2 hover:cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleTextTransformChange('none')}>
                                                    <p className="select-none normal-case">—</p>
                                                </div>
                                            </div>
                                            <div className="group relative inline-flex items-center justify-center">
                                                <div className="absolute z-50 m-2 hidden h-min w-max max-w-[11rem] rounded-md bg-black py-2 px-2 group-hover:block border border-neutral-700 bottom-full">
                                                    <p className="m-0 text-center text-xs text-white">{"Uppercase"}</p>
                                                    <div className="absolute top-full left-[45%] h-0 w-0 [border:_6px_solid_transparent] [border-top:_6px_solid_black]" />
                                                </div>
                                                <div className="p-2 hover:cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleTextTransformChange('uppercase')}>
                                                    <p className="select-none uppercase">{"Aa"}</p>
                                                </div>
                                            </div>
                                            <div className="group relative inline-flex items-center justify-center">
                                                <div className="absolute z-50 m-2 hidden h-min w-max max-w-[11rem] rounded-md bg-black py-2 px-2 group-hover:block border border-neutral-700 bottom-full">
                                                    <p className="m-0 text-center text-xs text-white">{"Lowercase"}</p>
                                                    <div className="absolute top-full left-[45%] h-0 w-0 [border:_6px_solid_transparent] [border-top:_6px_solid_black]" />
                                                </div>
                                                <div className="p-2 hover:cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleTextTransformChange('lowercase')}>
                                                    <p className="select-none dark:text-white lowercase">{"Aa"}</p>
                                                </div>
                                            </div>
                                            <div className="group relative inline-flex items-center justify-center">
                                                <div className="absolute z-50 m-2 hidden h-min w-max max-w-[11rem] rounded-md bg-black py-2 px-2 group-hover:block border border-neutral-700 bottom-full">
                                                    <p className="m-0 text-center text-xs text-white">{"Title Case"}</p>
                                                    <div className="absolute top-full left-[45%] h-0 w-0 [border:_6px_solid_transparent] [border-top:_6px_solid_black]" />
                                                </div>
                                                <div className="p-2 hover:cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleTextTransformChange('capitalize')}>
                                                    <p className="select-none capitalize">{"Aa"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* letter spacing */}
                                    <div>
                                        <h2 className="mb-2 text-xs tracking-wide text-neutral-400">{"Letter Space"}</h2>
                                        <div className="flex items-center justify-between gap-4 w-full">
                                            <div className="flex h-fit w-fit items-center gap-1 rounded-md border border-neutral-300  text-xs">
                                                <div className="inline-block">
                                                    <div className="w-full rounded-md">
                                                        <input
                                                            className="w-full rounded-md border focus:ring-0 focus-visible:outline-0   text-xs px-2 py-3 bg-transparent transition-colors duration-200"
                                                            placeholder="0.5"
                                                            type="number"
                                                            value={letterSpacing}
                                                            onChange={handleletterSpacingChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
            {/* ========== color settings ======== */}
                    {activeTab === 'color' && (
                        <div className="pt-4 w-[300px] m-auto">

                            {/* Pass state and setters as props to FontColor */}
                            <FontColor
                                textColor={textColor} setTextColor={setTextColor}
                                strokeColor={strokeColor} setStrokeColor={setStrokeColor}
                                emphasizeColor={emphasizeColor} setEmphasizeColor={setEmphasizeColor}
                            />
                        </div>
                    )}
            {/* ====== advance settings ======= */}
                    {activeTab === 'dots' && (
                        <div className="pt-4 w-[300px] m-auto">
                            {/* <PositionSettings /> */}
                            <PositionSettings
                                xPosition={xPosition} setXPosition={setXPosition}
                                yPosition={yPosition} setYPosition={setYPosition}
                                rotation={rotation} setRotation={setRotation}
                                scale={scale} setScale={setScale}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SubtitleEditor