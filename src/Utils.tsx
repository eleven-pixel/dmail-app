export default {
  fieldToCid(map:any):string {
    if (map == undefined) {
      return ""
    }
   
    let s = ''
    for(let i =1;i<= 8;i++) {
      let t:string  = map["slice" + i] 
      s += this.resetZero(t.replace("field",""))
    }
    return this.binary2Str(s)
  },
  binary2Str(bi:string):string {
    const len = bi.length
    let str =""
    for(let i =0;i< len;i+=8) {
      str += String.fromCharCode(parseInt(bi.substring(i,i + 8),2))
    }
    return str
  },
  cidToField(cid:string):string {
    if (!cid || typeof cid != "string") {
      return "{slice1:0field,slice2:0field,slice3:0field,slice4:0field,slice5:0field,slice6:0field,slice7:0field,slice8:0field}"
    }
    var bi = this.cidToBinary(cid)
    let str =""
    const len = bi.length
    var ll = 1;
    for(let i =0;i< len;i+=46) {
      str += "slice" + ll + ":" + this.removeZero(bi.substring(i,i + 46)) +"field"
      if (ll < 8) {
        str += ','
      }
      //console.log(i)
      ll++;
    } 
    return "{" +str + "}"
  },
  removeZero(s:string):string {
    while (s.startsWith("0")) {
      s = s.substring(1,s.length);
    }
    return s
  },
  resetZero(s:string):string {
    while (s.length < 46) {
      s = "0" + s;
    }
    return s
  },
  cidToBinary(cid:string) :string  { 
    const zero = "00000000"
    let bi ="";
    for (let i of cid) {
      let num = zero + i.charCodeAt(0).toString(2);
      bi += num.slice(-8);
    }
    return bi
  }
};

export const DMAIL_PROGRAM_NAME = 'dmail.aleo'; 