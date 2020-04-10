export class Model {
    
    constructor (genData, pageId) {
      if(genData){
        this.casename = genData['else-casename'];
        this.desc = genData['else-desc'];
        this.date = genData['else-date'];
        this.unit = genData['else-unit'];
        this.dr = genData['else-dr'];
        this.currency = genData['else-currency'];
        this.years = genData['else-years'];
        this.units = genData['else-units'];
        this.pageId = pageId;
      }else{
        this.casename = genData;
        this.desc = genData;
        this.date = genData;
        this.unit = genData;
        this.dr = genData;
        this.currency = genData;
        this.years = genData;
        this.units = genData;
        this.pageId = pageId;
      }
    }
}
