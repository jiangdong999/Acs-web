import country from "@/utils/country";
import countryChina from "@/utils/country_china";

export function transCertificateType(type) { //身份证、护照、港澳通行证、台胞证、临时居民身份证、户口簿、暂住证（居住证）、旅行证
  switch (type) {
    case '1':
      return "身份证";
    case '2':
      return "护照";
    case '3':
      return "港澳通行证";
    case '4':
      return "台胞证";
    case '5':
      return "临时居民身份证";
    case '6':
      return "户口簿";
    case '7':
      return "暂住证（居住证）";
    case '8':
      return "旅行证";
    default:
      return "";
  }
}

export function transHouseholdRole(type) {
  switch (type) {
    case '1':
      return "产权人";
    case '2':
      return "家庭成员";
    case '3':
      return "承租人";
    default:
      return "";
  }
}

export function transHouseholdDuty(value) {
  switch (value) {
    case '1':
      return "保洁";
    case '2':
      return "保安";
    case '3':
      return "客服";
    case '4':
      return "工程";
    case '5':
      return "居委";
    case '6':
      return "流管";
    case '7':
      return "送奶";
    case '8':
      return "送报";
    case '9':
      return "快递";
    case '10':
      return "测试";
    case '0':
      return "其他";
    default:
      return "";
  }
}

export function transGender(type) {
  switch (type) {
    case 'm':
      return "男";
    case 'f':
      return "女";
    default:
      return type;
  }
}

export function transNationality(type) {
  let r = countryChina.find(val => val.code === type);
  if (!r) {
    r = country.find(val => val.code === type);
  }
  if (r) {
    return r.cn;
  }
  return "";
}

export function transStatus(status) {
  switch (status) {
    case '0':
      return "无效";
    case '1':
      return "有效";
    default:
      return '';
  }
}

export function transMaritalStatus(status) {
  switch (status) {
    case '10':
      return "未婚";
    case '20':
      return "已婚";
    case '21':
      return "初婚";
    case '22':
      return "再婚";
    case '23':
      return "复婚";
    case '30':
      return "丧偶";
    case '40':
      return "离婚";
    case '90':
      return "未说明的婚姻状况";
  }
}

export function transPoliticalStatus(status) {
  switch (status) {
    case '01':
      return "中共党员";
    case '02':
      return "中共预备党员";
    case '03':
      return "共青团员";
    case '04':
      return "民革会员";
    case '05':
      return "民盟盟员";
    case '06':
      return "民建会员";
    case '07':
      return "民进会员";
    case '08':
      return "农工党党员";
    case '09':
      return "致公党党员";
    case '10':
      return "九三学社社员";
    case '11':
      return "台盟盟员";
    case '12':
      return "无党派民主人士 ";
    case '13':
      return "群众";
  }
}

export function transEducationLevel(level) {
  switch (level) {
    case '10':
      return "研究生教育";
    case '11':
      return "博士研究生毕业";
    case '12':
      return "博士研究生结业";
    case '13':
      return "博士研究生肄业";
    case '14':
      return "硕士研究生毕业";
    case '15':
      return "硕士研究生结业";
    case '16':
      return "硕士研究生肆业";
    case '17':
      return "研究生班毕业";
    case '18':
      return "研究生班结业";
    case '19':
      return "研究生班肄业";
    case '20':
      return "大学本科";
    case '21':
      return "大学本科毕业";
    case '22':
      return "大学本科结业";
    case '23':
      return "大学本科肆业";
    case '28':
      return "大学普通班毕业";
    case '30':
      return "专科教育";
    case '31':
      return "大学专科毕业";
    case '32':
      return "大学专科结业";
    case '33':
      return "大学专科肆业";
    case '40':
      return "中等职业教育";
    case '41':
      return "中等专科毕业";
    case '42':
      return "中等专科结业";
    case '43':
      return "中等专科肆业";
    case '44':
      return "职业高中毕业";
    case '45':
      return "职业高中结业";
    case '46':
      return "职业高中肆业";
    case '47':
      return "技工学校毕业";
    case '48':
      return "技工学校结业";
    case '49':
      return "技工学校肆业";
    case '60':
      return "普通高级中学教育";
    case '61':
      return "普通高中毕业";
    case '62':
      return "普通高中结业";
    case '63':
      return "普通高中肆业";
    case '70':
      return "初级中学教育";
    case '71':
      return "初中毕业";
    case '73':
      return "初中肄业";
    case '80':
      return "小学教育";
    case '81':
      return "小学毕业";
    case '83':
      return "小学肄业";
    case '90':
      return "其他";
  }
}

export function transMilitaryServiceStatus(status) {
  switch (status) {
    case '1':
      return "未服兵役";
    case '2':
      return "服兵役";
    case '3':
      return "预备役";
    case '4':
      return "退出现役";
  }
}

export function transLeaseTypeStatus(status) {
  switch (status) {
    case '3':
      return "三个月";
    case '6':
      return "六个月";
    case '12':
      return "十二个月";
  }
}

export function transReligion(status) {
  switch (status) {
    case '00':
      return "无宗教信仰";
    case '10':
      return "佛教";
    case '20':
      return "喇嘛教";
    case '30':
      return "道教";
    case '40':
      return "天主教";
    case '50':
      return "基督教";
    case '60':
      return "东正教";
    case '70':
      return "伊斯兰教";
    case '99':
      return "其他";

  }
}

export function transCareer(status) {
  switch (status) {
    case '11':
      return "国家公务员";
    case '13':
      return "专业技术人员";
    case '17':
      return "职员";
    case '21':
      return "企业管理人员";
    case '24':
      return "工人";
    case '27':
      return "农民";
    case '31':
      return "学生";
    case '37':
      return "现役军人";
    case '51':
      return "自由职业者";
    case '54':
      return "个体经营者";
    case '70':
      return "无业人员";
    case '80':
      return "退（离）休人员";
    case '90':
      return "其他";
  }
}

export function transStayReason(status) {
  switch (status) {
    case '1':
      return "旅游观光";
    case '2':
      return "探亲";
    case '3':
      return "务工";
    case '4':
      return "公司聘用";
    case '5':
      return "经商";
    case '6':
      return "因公出差";
    case '7':
      return "随迁学龄子女";
    case '8':
      return "投靠";
    case '9':
      return "上学";
    case '10':
      return "其他";
  }
}

export function transWorkStatus(status) {
  switch (status) {
    case '1':
      return "退休";
    case '2':
      return "在职";
    case '3':
      return "待业";
    case '4':
      return "学生";
    case '5':
      return "自主经营";
  }
}
export function transFaceSourceStatus(status) {
  switch (status) {
    case '1':
      return "睿视APP";
    case '2':
      return "管理平台";
  }
}

export function relationshipOptions(status) {
  switch (status) {
    case '1':
      return "配偶";
    case '2':
      return "子女";
    case '3':
      return "父母";
    case '4':
      return "亲属";
    case '5':
      return "朋友";
  }
}
