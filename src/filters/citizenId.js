export function formatCitizenId(ID) {
  if(ID){
    const length = ID.length;

    if(length == 15 || length == 18){

      let before = Math.floor(length / 3) > 0 ? Math.floor(length / 3) : 1;
      let after = Math.floor(length / 4) > 0 ? Math.floor(length / 4) : 1;

      return ID.slice(0, before) + outPrint(length - before - after) + ID.slice(length-after)

    }else{
      return ID
    }
  }else{
    return '';
  }
}

function outPrint(number){
  if(number > 0){
    return '*' + outPrint(number - 1)
  }else{
    return ''
  }
}