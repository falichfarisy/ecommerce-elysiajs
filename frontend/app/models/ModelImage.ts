class ModelImage {
    name: string;
    url: string;

    constructor(name: string, url: string){
        this.name = name;
        this.url = url;
    }

    getImage(){
        return [this.name, this.url]
    }
}