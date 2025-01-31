class ContentSlide {
    constructor(config) {
        this.slideNumber = config.slideNumber;
        this.title = config.title;
        this.audio_text = config.audio_text;
        this.initContent(config);
    }
    initContent(config) {
        const contentArr = [];
        if (config.content) {
            config.content.forEach((contentEntry) => {
                if (!contentEntry.image) {
                    contentEntry.image = [];
                }
                if (!contentEntry.text) {
                    contentEntry.text = [];
                }
                const contentChild = {
                    image: Array.isArray(contentEntry.image) ? contentEntry.image : [contentEntry.image],
                    text: Array.isArray(contentEntry.text) ? contentEntry.text : [contentEntry.text],
                };
                contentArr.push(contentChild);
            })
        }
        this.content = contentArr;
    }
    initLayout(layout) {
        layout.forEach((layoutEntry, index) => {
            if (this.content[index]) {
                const slideContent = this.content[index];
                this.content[index] = {
                    ...slideContent,
                    layout: layoutEntry
                }
            }
        })
    }
}
export default class ContentLayoutModel {
    constructor() {
        this.slidesMap = [];
    }

    update(config) {
        this.slidesMap = new Map(config.map((slideConfig) => [slideConfig.slideNumber, new ContentSlide(slideConfig)]));
    }

    updateLayout(slideConfig, layout) {
        const slide = this.slidesMap.get(slideConfig.slideNumber);
        this.slidesMap.set(slide.slideNumber, slide.initLayout(layout));
    }

    getContentSlide(slideConfig) {
        return this.slidesMap.get(slideConfig.slideNumber);
    }

}