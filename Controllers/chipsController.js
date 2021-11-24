class ChipsController{
    
    constructor(){};

    init(){
        document.addEventListener('DOMContentLoaded', () => {
            let elems = document.querySelectorAll('.chips');
            let options = {
                placeholder: 'Adicione e aperte enter',
                secondaryPlaceholder: 'Adicione mais...'
            }

            M.Chips.init(elems, options);
        });
    }

    clear() {
        const chips = document.querySelectorAll('.chips');
        const instance = chips[0].M_Chips;

        let chipsLenght =  instance.chipsData.length;

        for(let index = 0; index <= chipsLenght; index++){
            instance.deleteChip(0);
        }
    }

    getElementChipByTag(tagName){
        var indexTag = undefined;

        for(let i = 0; i < this.chips.length; i++){
            let name = this.chips[i].tag;
            
            console.log(tagName, '=', name);
            console.log(tagName == name);
            if(tagName == name){
                console.log(this.chips[i].tag);
                indexTag = i;
            }
        }
        console.log(indexTag);
        console.log(this.instance.$chips);

        return this.instance.$chips[indexTag];
    }

    get instance(){
        const chips = document.querySelectorAll('#chips');
        let instance = chips[0].M_Chips;

        return instance;
    }

    get chips(){
        let chips = this.instance.chipsData;
        return chips;
    }
}