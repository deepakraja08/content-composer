import ContentLayoutModel from './content-layout-model';
// import LayoutMapperModel from '../nn-model/layout-mapper-model';
import PptxGenJS from 'pptxgenjs';

export default class contentPPTSerializer {
    constructor() {
        this.ppt = new PptxGenJS();
        // this.layoutMapperModel = new LayoutMapperModel();
        this.ContentLayoutModel = new ContentLayoutModel();
    }

    generateBullet() {
        const bulletUnicodeCharacters = [
            '•', // Bullet (U+2022)
            '○', // Circle (U+25CB)
            '▪', // Black small square (U+25AA)
            '▫', // White small square (U+25AB)
            '✔', // Tick (U+2714)
            '★', // Star (U+2605)
            '☆', // White star (U+2606)
            '→', // Right arrow (U+2192)
            '→', // Right arrow (U+2192)
            '➤', // Arrow with thick stem (U+27A4)
        ];

        const min = 0;  // Starting index (inclusive)
        const max = bulletUnicodeCharacters.length - 1; // Ending index (inclusive)

        // Generate a random number between min and max (both inclusive)
        const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        return bulletUnicodeCharacters[randomIndex];
    }
    generateBGImage() {
        const min = 1;
        const max = 14;
        const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        return `background/img${randomIndex}.png`;
    }
    updateContentLayoutModel(config) {
        this.ContentLayoutModel.update(config);
        // implement this AI capability to automap layouts
        // config.forEach((configEntry) => {
        //     configEntry.content.forEach((contentConfig) => {
        //         const layoutConfig = this.layoutMapperModel.get(contentConfig);
        //         this.ContentLayoutModel.updateLayout(contentConfig, layoutConfig);
        //     })
        // })
    }

    generateGradient() {
        const getRandomLightColor = () => {
            const base = 200; // Keep colors in the lighter range (200-255)
            const r = base + Math.floor(Math.random() * (255 - base));
            const g = base + Math.floor(Math.random() * (255 - base));
            const b = base + Math.floor(Math.random() * (255 - base));
            return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`.toUpperCase();
        };

        const color1 = getRandomLightColor();

        return color1;
    }

    getScaledDimensions(imgWidth, imgHeight, maxWidth, maxHeight) {
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        return {
            width: imgWidth * scale,
            height: imgHeight * scale
        };
    }


    create(config) {
        this.ppt = new PptxGenJS();
        this.pptGradient = this.generateGradient();
        this.updateContentLayoutModel(config);
        const imgPath = this.generateBGImage()
        console.log(imgPath);

        config.forEach((configEntry) => {
            let slide = this.ppt.addSlide();
            const fontFace =  "Roboto Light"; // Use a professional font


            const contentSlide = this.ContentLayoutModel.getContentSlide(configEntry);
            slide.background = { path: imgPath };

            // Add presentation title
            if (contentSlide.title && !contentSlide.content.length) {
                slide.addText(contentSlide.title, {
                    w: 10,
                    h: 5,
                    fontSize: 28,
                    bold: true,
                    color: '000000',
                    fontFace,
                    align: 'center',
                });
            }

            // Add slide title if available
            if (contentSlide.title && contentSlide.content.length) {
                slide.addText(contentSlide.title, {
                    w: 10,
                    h: 0.8,
                    fontSize: 28,
                    bold: true,
                    color: '000000',
                    fontFace,
                    align: 'center',
                });
            }

            // Content section with images and text
            if (contentSlide.content.length > 0) {
                const contentSize = Math.max(contentSlide.content.length, 1);
                const numColumns = Math.min(contentSize, 4);
                const numRows = Math.ceil(contentSize / numColumns);
                this.START_X = 1;
                this.START_Y = 1;
                this.COLUMN_WIDTH = 9 / numColumns;
                this.ROW_HEIGHT = 9 / numRows;
                this.MAX_COLUMNS = numColumns;
                const bulletChar = this.generateBullet()
                contentSlide.content.forEach(async (item, index) => {
                    let row = Math.floor(index / this.MAX_COLUMNS);
                    let col = index % this.MAX_COLUMNS;
                    let x = this.START_X + col * this.COLUMN_WIDTH;
                    let y = this.START_Y + row * this.ROW_HEIGHT;

                    // Handle text only content
                    if (!item.image?.length && item.text?.length > 0) {
                        slide.addText(
                            item.text.map(text => `${bulletChar}    ${text}`).join("\n"),
                            {
                                x,
                                y,
                                w: this.COLUMN_WIDTH - 0.2,
                                fontSize: 10,
                                color: "000000",
                                align: "left",
                                spaceBefore: 5,
                                bulletChar: bulletChar,
                                fontFace,
                            }
                        );
                    } else if (item.image?.length > 0 && !item.text?.length) {
                            const scale = 0.4;
                            const totalImageHeight = (scale * this.ROW_HEIGHT);
                            const imageHeight = totalImageHeight / item.image.length;
                            const imageWidth = scale * this.COLUMN_WIDTH
                            const offset = (this.COLUMN_WIDTH - imageWidth) / 2

                            item.image.forEach((imageEntry, imgIndex) => {
                                slide.addImage({
                                    path: imageEntry,
                                    x: x + (0.8 * offset),
                                    y: y + (imgIndex * imageHeight),
                                    w: imageWidth,
                                    h: imageHeight,
                                    sizing: {
                                        type: 'contain',
                                    },
                                });
                                y += 0.1;
                            });
                    } else {
                        // Handle image content
                        if (item.image?.length > 0) {
                            const scale = 0.4;
                            const totalImageHeight = (scale * this.ROW_HEIGHT);
                            const imageHeight = totalImageHeight / item.image.length;
                            const imageWidth = scale * this.COLUMN_WIDTH
                            const offset = (this.COLUMN_WIDTH - imageWidth) / 2

                            item.image.forEach((imageEntry, imgIndex) => {
                                slide.addImage({
                                    path: imageEntry,
                                    x: x + (0.8 * offset),
                                    y: y + (imgIndex * imageHeight),
                                    w: imageWidth,
                                    h: imageHeight,
                                    sizing: {
                                        type: 'contain',
                                    },
                                });
                                y += 0.1;
                            });
                            y += totalImageHeight + 0.2; // Add extra gap after images
                        }

                        // Handle text content
                        if (item.text?.length > 0) {
                            slide.addText(
                                item.text.map(text => `${text}`).join("\n"),
                                {
                                    x,
                                    y,
                                    w: this.COLUMN_WIDTH - 0.2,
                                    fontSize: 10,
                                    color: "000000",
                                    bold: true,
                                    align: "left",
                                    fontFace,
                                }
                            );
                        }

                    }
                });
            }
        });
        try {
            this.ppt.writeFile({ fileName: `Slide-${config[0]?.title || 'Presentation'}.pptx` });
        } catch (error) {
            console.error("Error generating PPT:", error);
        }
    }


}