exports.convert_inr_to_coin = (balance)=>{
    return balance * 10;
}

exports.addDays=(date, days)=>{
    var result = new Date(date);
   result.setDate(result.getDate() + days);
   return result;
  }
  