class LexicalController{
    
    globalState = 0;
    tableData = [];
    states = [[]];

    constructor(){
        this.chipsController = undefined;
        this.tableData = [];
        this.states = [[]];
    }

    init(){
        this.chipsController = new ChipsController();
        this.chipsController.init();
        this.startValidation();
    }

    startValidation(){
        let input = document.getElementById('word');
        input.addEventListener('keyup', this.wordValidate.bind(null,this), false);
    }

    wordValidate($this){
        console.log($this);

        let chipsListLength = $this.chipsController.chips.length;
        if(chipsListLength > 0) {
            console.log('up');

            let word = document.getElementById('word').value.toLowerCase();
            let tableLines = document.querySelectorAll('tr');
            let tableColumns = document.querySelectorAll('td');

            if(word.length == 0){
                tableLines.forEach((line)=> {line.classList.remove('focus-line')});
                tableColumns.forEach((column) => {column.classList.remove('focus-column')});

                console.log(tableLines);
                console.log(tableColumns);
            }
            let state = 0;
            let stateError = false;
            
            for(let i=0; i < word.length; i++) {
                let exprRegular = /([a-z_])/;
                if(exprRegular.test(word[i]) && stateError == false){
                    console.log($this.tableData);
                    $this.tableHighlight(state, word[i], $this.tableData[state][word[i]]);
                    
                    if($this.tableData[state][word[i]] != '-'){
                        state = $this.tableData[state][word[i]];
                    } else { 
                        stateError = true;
                    }
                } else if(word[i] == ' ' || word[i] == '/n'){
                    let elementChip = $this.chipsController.getElementChipByTag(word.replace(/^\s+|\s+$/g, ''));
                    
                    if(elementChip != undefined){
                        let input = document.getElementById('word');
                        input.value = '';
                        
                        LexicalController.removeHighlight();
                        
                        $this.wordFoundedHighlight(elementChip);
                    }

                } else if(stateError == false) {
                    alert("Apenas caracteres válidos");
                }
            }
            
        }
    };

    updateTable(){
        this.mountWordState();
        this.tableData = this.creteLineInTable();
        this.mountTable(this.tableData);

    }

    updateNameButtom(name){
        let buttom = document.getElementById('update-table');
        buttom.innerHTML = name;
    }

    mountTable(tableData){
        let tableBody = this.table.children[1];

        this.updateNameButtom('Atualizar Tabela');

        tableBody.innerHTML = ''
        for(let i=0; i < tableData.length; i++){
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            
            if(tableData[i]['finished']){
                td.innerText = 'q' + tableData[i]['state'] + '*';
            } else {
                td.innerText = 'q' + tableData[i]['state'];
            }
            td.classList.add('tem-sel');
            td.classList.add('center');
            td.classList.add('border-custom');

            tr.append(td);
            tr.classList.add('line_' + tableData[i]['state']);

            let firstChar = 'a';
            let lastChar = 'z';

            for(let j = firstChar.charCodeAt(0); j <= lastChar.charCodeAt(0); j++) {
                let char = String.fromCharCode(j);
                let td = document.createElement('td');
                
                td.classList.add('column_'+char);
                td.classList.add('center');

                if(tableData[i][char] != '-'){
                    td.innerText = 'q' + tableData[i][char];
                    td.classList.add('tem-sel');
                } else {
                    td.innerText = '-';
                    td.classList.add('border-custom');
                }

                tr.append(td);
            }

            tableBody.append(tr);
	    }
    }

    mountWordState(){
        const chips = this.chipsController.chips;
        
        for(let i=0; i<chips.length; i++) {
            let currentState = 0;
            let word = chips[i].tag;

            for(let j=0; j<word.length; j++){
                if(typeof this.states[currentState][word[j]] === 'undefined'){
                    let nextState = this.globalState + 1;

                    this.states[currentState][word[j]] = nextState;
                    this.states[nextState] = [];

                    console.log("States: ", this.states);

                    this.globalState = currentState = nextState;
                    console.log("Global State: ", this.globalState);

                } else {
                    console.log("States: ", this.states);

                    currentState = this.states[currentState][word[j]];

                    console.log("Current State: ", currentState);
                }
    
                if(j == word.length - 1){
                    this.states[currentState]['finished'] = true;
                }
            }
        }
    };

    creteLineInTable(){
        let stateArray = [];

        for(let i=0; i < this.states.length; i++) {
            let aux = [];
            aux['state'] = i;
            let firstChar = 'a';
            let lastChar = 'z';

            for(var j=firstChar.charCodeAt(0); j<=lastChar.charCodeAt(0); j++) {
                let char = String.fromCharCode(j);
                if(typeof this.states[i][char] === 'undefined'){
                    aux[char] = '-';
                } else {
                    aux[char] = this.states[i][char];
                }
            }
            if(typeof this.states[i]['finished'] !== 'undefined'){
                aux['finished'] = true;
            }
            stateArray.push(aux);
        }

        return stateArray;
    }

    tableHighlight(state, char, stateError){
        LexicalController.removeHighlight();
        LexicalController.addHighLight(state, char, stateError);
    };

    wordFoundedHighlight(element){
        element.classList.add('word-founded');
    }

    static removeHighlight(){
        let tableLines = document.querySelectorAll('tr');
        let tableColumns = document.querySelectorAll('td');
        
        tableLines.forEach((line)=>{
            line.classList.remove('focus-line');
            line.classList.remove('focus-column-error')
        });
        
        tableColumns.forEach((column) => {
            column.classList.remove('focus-column');
            column.classList.remove('focus-column-error');

        });
        
    }

    static addHighLight(state, char, stateError){
        let tableLine = document.querySelectorAll('.line_' + state);
        let tableColumn = document.querySelectorAll('.column_' + char);

        console.log('line');
        console.log(JSON.stringify(stateError));

        if(stateError == '-'){
            tableLine.forEach((line) => {line.classList.add('focus-column-error')});
            tableColumn.forEach((column) => {column.classList.add('focus-column-error')});
        }else{
            tableLine.forEach((line) => {line.classList.add('focus-line')});
            tableColumn.forEach((column) => {column.classList.add('focus-column')});
        }
    }
    
    clear(){
        this.chipsController.clear();
        this.cleanInputWord();
        this.cleanTable();
        this.updateNameButtom('Preencher Tabela');
    }

    cleanTable(){
        let tableBody = this.table.children[1];

        tableBody.innerHTML = '';
    }

    cleanInputWord(){
        let input = document.querySelector('#word');
        input.value = '';
        let label = document.querySelector('[for="word"]');
        label.classList.remove("active");
    }

    get table(){
        const table = document.getElementById('lexical-table');
        return table;
    }
    
    set states(statesList){
        this.states = statesList;
    }
    
    get states(){
        return this.states;
    }

    
}