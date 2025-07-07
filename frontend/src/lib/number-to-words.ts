// Arabic number to words conversion
export function numberToArabicWords(num: number): string {
  if (num === 0) return "صفر";
  
  const ones = [
    "", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
    "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر",
    "سبعة عشر", "ثمانية عشر", "تسعة عشر"
  ];
  
  const tens = [
    "", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"
  ];
  
  const hundreds = [
    "", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"
  ];
  
  const scales = [
    "", "ألف", "مليون", "مليار", "تريليون"
  ];
  
  if (num < 0) {
    return "سالب " + numberToArabicWords(Math.abs(num));
  }
  
  if (num < 20) {
    return ones[num];
  }
  
  if (num < 100) {
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    return tens[tensDigit] + (onesDigit > 0 ? " و" + ones[onesDigit] : "");
  }
  
  if (num < 1000) {
    const hundredsDigit = Math.floor(num / 100);
    const remainder = num % 100;
    return hundreds[hundredsDigit] + (remainder > 0 ? " و" + numberToArabicWords(remainder) : "");
  }
  
  // Handle thousands and above
  let result = "";
  let scaleIndex = 0;
  
  while (num > 0) {
    const group = num % 1000;
    if (group > 0) {
      let groupText = "";
      
      if (group < 1000) {
        groupText = numberToArabicWords(group);
      }
      
      if (scaleIndex > 0) {
        if (scaleIndex === 1) { // thousands
          if (group === 1) {
            groupText = "ألف";
          } else if (group === 2) {
            groupText = "ألفان";
          } else if (group >= 3 && group <= 10) {
            groupText = groupText + " آلاف";
          } else {
            groupText = groupText + " ألف";
          }
        } else { // millions, billions, etc.
          groupText = groupText + " " + scales[scaleIndex];
        }
      }
      
      result = groupText + (result ? " و" + result : "");
    }
    
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  
  return result;
}

// Convert currency amount to Arabic words
export function currencyToArabicWords(amount: number, currency: string = "ريال"): string {
  if (amount === 0) return "صفر " + currency;
  
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  let result = "";
  
  if (integerPart > 0) {
    result += numberToArabicWords(integerPart);
    
    // Add currency name with proper grammar
    if (integerPart === 1) {
      result += " " + currency;
    } else if (integerPart === 2) {
      result += " " + currency + "ان";
    } else if (integerPart >= 3 && integerPart <= 10) {
      result += " " + currency + "ات";
    } else {
      result += " " + currency;
    }
  }
  
  if (decimalPart > 0) {
    if (result) result += " و";
    result += numberToArabicWords(decimalPart);
    
    // Add "هللة" for cents/fils
    if (decimalPart === 1) {
      result += " هللة";
    } else if (decimalPart === 2) {
      result += " هللتان";
    } else if (decimalPart >= 3 && decimalPart <= 10) {
      result += " هللات";
    } else {
      result += " هللة";
    }
  }
  
  return result;
}

// Format price with Arabic words only (no numbers)
export function formatPriceWithWords(amount: number, currency: string = "ريال"): string {
  const wordsPrice = currencyToArabicWords(amount, currency);
  
  return wordsPrice;
}