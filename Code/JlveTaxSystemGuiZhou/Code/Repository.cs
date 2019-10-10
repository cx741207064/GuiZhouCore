using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web;
using System.Text;
using JlveTaxSystemGuiZhou.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace JlveTaxSystemGuiZhou.Code
{
    public class Repository
    {
        GDTXUserYSBQC qc { get; set; }

        GDTXDate gd { get; set; }

        YsbqcSetting set { get; set; }

        IHostingEnvironment he { get; }

        public Repository(YsbqcSetting _set, IHostingEnvironment _he)
        {
            he = _he;
            set = _set;
            insert();
        }

        protected void insert()
        {
            string split = "/";
            string userId = set.getSession().userId;
            if (string.IsNullOrEmpty(userId))
            {
                string logPath = he.ContentRootPath + split + "Log";
                DirectoryInfo[] DIs = Directory.CreateDirectory(logPath).GetDirectories();
                userId = DIs[0].Name;
                for (int i = 0; i <= DIs.Count() - 2; i++)
                {
                    if (DIs[i].LastWriteTime < DIs[i + 1].LastWriteTime)
                    {
                        userId = DIs[i + 1].Name;
                    }
                }
            }

            string path = he.ContentRootPath + split + "Log" + split + userId;
            string fileFullPath = path + split + "Session.json";
            if (!System.IO.File.Exists(fileFullPath))
            {
                return;
            }
            string str = System.IO.File.ReadAllText(fileFullPath);
            JObject jo = JsonConvert.DeserializeObject<JObject>(str);
            set.insertSession(jo);
        }

        public GDTXUserYSBQC getUserYSBQC(Type controller)
        {
            string s = controller.Name;
            s = s.Substring(0, s.IndexOf("Controller"));
            GTXResult resultq = GTXMethod.GetUserYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXUserYSBQC>>(resultq.Data.ToString());

                ysbqclist = ysbqclist.Where(a => a.BDDM.ToUpper() == s.ToUpper()).ToList();
                return ysbqclist[0];
            }
            else
            {
                //return new GDTXBeiJingUserYSBQC();
                return null;
            }
        }

        public GDTXUserYSBQC getUserYSBQC(string dm)
        {
            string s = dm.ToUpper();
            switch (s)
            {
                case "YBNSRZZSXBSZ":
                    s = "YBNSRZZS";
                    break;
            }
            GTXResult resultq = GTXMethod.GetUserYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXUserYSBQC>>(resultq.Data.ToString());

                ysbqclist = ysbqclist.Where(a => a.BDDM.ToUpper() == s).ToList();
                return ysbqclist[0];
            }
            else
            {
                return null;
            }
        }

        public GDTXUserYSBQC getUserYSBQC(int id)
        {
            GTXResult resultq = GTXMethod.GetUserYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXUserYSBQC>>(resultq.Data.ToString());

                ysbqclist = ysbqclist.Where(a => a.Id == id).ToList();
                return ysbqclist[0];
            }
            else
            {
                return null;
            }
        }

        public List<GDTXUserYSBQC> getUserYSBQC()
        {
            GTXResult resultq = GTXMethod.GetUserYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXUserYSBQC>>(resultq.Data.ToString());
                return ysbqclist;
            }
            else
            {
                return null;
            }
        }

        public List<GDTXUserYSBQC> getYsbYSBQC()
        {
            GTXResult resultq = GTXMethod.GetUserYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXUserYSBQC>>(resultq.Data.ToString());

                ysbqclist = ysbqclist.Where(a => a.SBZT == SBZT.YSB).ToList();
                return ysbqclist;
            }
            else
            {
                return null;
            }
        }

        public GTXResult SaveUserYSBQCReportData(JToken json, int userYsbqcId, string reportCode, string dataKey = "data")
        {
            List<GTXNameValue> nameList = new List<GTXNameValue>();
            GTXNameValue nv = new GTXNameValue();
            nv.key = dataKey;
            byte[] bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(json, Newtonsoft.Json.Formatting.None));
            string _result = HttpUtility.UrlEncode(Convert.ToBase64String(bytes));
            nv.value = _result;
            nameList.Add(nv);
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), userYsbqcId.ToString(), reportCode);
            return saveresult;
        }

        public GTXResult SaveUserYSBQCReportData(string strJson, int userYsbqcId, string reportCode, string dataKey = "data")
        {
            List<GTXNameValue> nameList = new List<GTXNameValue>();
            GTXNameValue nv = new GTXNameValue();
            nv.key = dataKey;
            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            string _result = HttpUtility.UrlEncode(Convert.ToBase64String(bytes));
            nv.value = _result;
            nameList.Add(nv);
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), userYsbqcId.ToString(), reportCode);
            return saveresult;
        }

        public void UpdateSBSE(int id, string sbse)
        {
            GTXMethod.UpdateSBSE(id.ToString(), sbse);
        }

        public void UpdateSBZT(int id, string sbzt)
        {
            GTXMethod.UpdateYSBQC(id.ToString(), sbzt);
        }

        public void sbZfSubmit(int id)
        {
            qc = getUserYSBQC(id);
            GTXMethod.UpdateYSBQC(id.ToString(), SBZT.WSB);
            GTXMethod.UpdateSBSE(id.ToString(), "");
            GTXMethod.DeleteUserReportData(id.ToString(), qc.ywbm);
        }

        public JToken getUserYSBQCReportData(int id, string reportCode, string dataKey = "data")
        {
            GTXResult gr = GTXMethod.GetUserReportData(id.ToString(), reportCode);
            if (gr.IsSuccess)
            {
                List<GDTXUserYSBQCReportData> dataList = JsonConvert.DeserializeObject<List<GDTXUserYSBQCReportData>>(gr.Data.ToString());
                if (dataList.Count > 0)
                {
                    GDTXUserYSBQCReportData data = dataList.Where(a => a.DataKey == dataKey).FirstOrDefault();
                    byte[] outputb = Convert.FromBase64String(data.DataValue);
                    string dataValue = Encoding.UTF8.GetString(outputb);
                    JToken re_json = JsonConvert.DeserializeObject<JToken>(dataValue);
                    return re_json;
                }
            }
            return JToken.FromObject(new object());
        }

        public GDTXDate getGDTXDate(string dm)
        {
            gd = new GDTXDate();
            qc = getUserYSBQC(dm);
            gd.sbrqq = qc.HappenDate.Substring(0, 8) + "01";
            gd.sbrqz = qc.SBQX;
            gd.sbNd = qc.HappenDate.Substring(0, 4);
            gd.sbYf = qc.HappenDate.Substring(5, 2);
            gd.skssq = qc.SKSSQQ.Substring(0, 7);
            gd.skssqq = qc.SKSSQQ;
            gd.skssqz = qc.SKSSQZ;
            gd.tbrq = qc.HappenDate;
            gd.skssNd = qc.SKSSQQ.Substring(0, 4);
            gd.skssYf = qc.SKSSQQ.Substring(5, 2);
            return gd;
        }

        public GDTXDate getGDTXDate(int id)
        {
            qc = getUserYSBQC(id);
            gd = getGDTXDate(qc.BDDM);
            return gd;
        }

        public Nsrxx getNsrxx()
        {
            Nsrxx X = new Nsrxx();
            GTXResult gr1 = GTXMethod.GetCompanyDetail();
            if (gr1.IsSuccess)
            {
                JObject jo = new JObject();
                jo = JsonConvert.DeserializeObject<JObject>(gr1.Data.ToString());
                JToken Company = jo["Company"];
                if (Company.HasValues)
                {
                    JToken data_jo = Company;
                    X.NSRMC = data_jo["NSRMC"].ToString();
                    X.NSRSBH = data_jo["NSRSBH"].ToString();
                    X.DJZCLX = data_jo["DJZCLX"].ToString();
                    X.ZCDZ = data_jo["ZCDZ"].ToString();
                    X.SCJYDZ = data_jo["SCJYDZ"].ToString();
                    X.LXDH = data_jo["LXDH"].ToString();
                    X.GBHY = data_jo["GBHY"].ToString();
                    X.ZGDSSWJFJMC = data_jo["ZGDSSWJFJMC"].ToString();
                    X.TaxPayerType = int.Parse(data_jo["TaxPayerType"].ToString());
                    X.TaxPayerTypeName = data_jo["TaxPayerTypeName"].ToString();
                    X.BusinessType = int.Parse(data_jo["BusinessType"].ToString());
                    X.BusinessTypeName = data_jo["BusinessTypeName"].ToString();
                }
            }

            GTXResult gr2 = GTXMethod.GetCompanyPerson();
            if (gr2.IsSuccess)
            {
                JArray ja = new JArray();
                ja = JsonConvert.DeserializeObject<JArray>(gr2.Data.ToString());
                if (ja.Count > 0)
                {
                    JObject data_jo = (JObject)ja[0];
                    X.Name = data_jo["Name"].ToString();
                    X.IDCardNum = data_jo["IDCardNum"].ToString();
                }
            }
            return X;
        }

        public void reset(string dm)
        {
            qc = getUserYSBQC(dm);
            GTXMethod.DeleteUserReportData(qc.Id.ToString(), qc.ywbm);
        }

    }
}
