using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using JlveTaxSystemGuiZhou.Models;
using System.Xml;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace JlveTaxSystemGuiZhou.Code
{
    public class Service
    {
        YsbqcSetting set { get; set; }

        IHostingEnvironment he { get; }

        Repository repos { get; set; }

        GDTXUserYSBQC qc { get; set; }

        GDTXDate gd { get; set; }

        Nsrxx xx { get; set; }

        JToken dbData { get; set; }

        public Service(YsbqcSetting _set, Repository _rep, IHostingEnvironment _he)
        {
            he = _he;
            set = _set;
            repos = _rep;
        }

        public async Task SaveDataService(Ywbm ywbm, JToken input)
        {
            await Task.Run(() =>
            {
                if (ywbm == Ywbm.cwbbydy)
                {
                    return;
                }
                qc = repos.getUserYSBQC(ywbm.ToString());
                GTXResult saveresult = repos.SaveUserYSBQCReportData(input, qc.Id, ywbm.ToString());
                if (saveresult.IsSuccess)
                {
                    UpdateYsbqcSBSE(qc.Id, input, ywbm);
                }
            });
        }

        public void UpdateYsbqcSBSE(int userYSBQCId, JToken input_jo, Ywbm ywbm)
        {
            string sbse = "";
            switch (ywbm)
            {
                case Ywbm.ybnsrzzs:
                    sbse = input_jo["zzsybsbSbbdxxVO"]["zzssyyybnsr_zb"]["zbGrid"]["zbGridlbVO"][0]["bqybtse"].ToString();
                    break;
                case Ywbm.fjssb:
                    sbse = input_jo.SelectToken("fjsSbbdxxVO.fjssbb.sbxxGrid.bqybtsehj").ToString();
                    break;
                case Ywbm.qysds_a_18yjd:
                    sbse = input_jo.SelectToken("ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj").ToString();
                    break;
                case Ywbm.xgmzzs:
                    sbse = input_jo.SelectToken("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[0].bqybtse").ToString();
                    break;
                case Ywbm.yhssb:
                    sbse = input_jo.SelectToken("yyssbbdxxVO.yhssb.yhssbGrid.bqybtsehj").ToString();
                    break;
            }
            sbse = string.IsNullOrEmpty(sbse) ? "0" : sbse;
            repos.UpdateSBSE(userYSBQCId, sbse);
        }

        public async Task getInitData(Ywbm ywbm, JObject initJobj)
        {
            await Task.Run(() =>
            {
                qc = repos.getUserYSBQC(ywbm.ToString());
                dbData = repos.getUserYSBQCReportData(qc.Id, qc.BDDM);
                if (dbData.HasValues)
                {
                    initJobj["body"] = JsonConvert.SerializeObject(dbData);
                    initJobj["flagExecuteInitial"] = false;
                }
                else
                {
                    JObject nsrjbxx;
                    JToken xgmzg;
                    JObject sbbhead;
                    gd = repos.getGDTXDate(qc.BDDM);
                    JObject body = JObject.Parse(initJobj["body"].Value<string>());
                    switch (ywbm)
                    {
                        case Ywbm.ybnsrzzs:
                            nsrjbxx = (JObject)body.SelectToken("qcs.initData.nsrjbxx");
                            IEnumerable<JToken> sbbheads = body.SelectTokens("zzsybsbSbbdxxVO..sbbhead");
                            IEnumerable<JToken> sbbHeads = body.SelectTokens("zzsybsbSbbdxxVO..sbbHead");
                            IEnumerable<JToken> sbbheadVOs = body.SelectTokens("zzsybsbSbbdxxVO..sbbheadVO");
                            IEnumerable<JToken> sbbxxVOs = body.SelectTokens("zzsybsbSbbdxxVO..sbbxxVO");
                            JObject zzsybnsrsbInitData = (JObject)body.SelectToken("qcs.initData.zzsybnsrsbInitData");
                            JToken slxxForm = body.SelectToken("zzsybsbSbbdxxVO.zzssyyybnsr_zb.slxxForm");
                            JArray zbGridlbVO = (JArray)body.SelectToken("zzsybsbSbbdxxVO.zzssyyybnsr_zb.zbGrid.zbGridlbVO");

                            //设置声明人签字
                            xx = repos.getNsrxx();
                            slxxForm["smr"] = new JValue(xx.Name);

                            //清空银行卡信息
                            zzsybnsrsbInitData["zzsybnsrSfxy"] = new JArray();

                            //设置日期
                            zzsybnsrsbInitData["sbrq"] = gd.tbrq;
                            zzsybnsrsbInitData["sssq"]["rqQ"] = gd.skssqq;
                            zzsybnsrsbInitData["sssq"]["rqZ"] = gd.skssqz;
                            setYbnsrzzsEverySheet(sbbheads);
                            setYbnsrzzsEverySheet(sbbHeads);
                            setYbnsrzzsEverySheet(sbbheadVOs);
                            setYbnsrzzsEverySheet(sbbxxVOs);

                            setNsrxx(nsrjbxx);
                            setYbnsrzzsBnlj(zzsybnsrsbInitData);
                            setYbnsrzzsBnljAdditional(zbGridlbVO);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case Ywbm.fjssb:
                            nsrjbxx = (JObject)body["qcs"]["initData"]["nsrjbxx"];
                            JObject fjssbInitData = (JObject)body["qcs"]["initData"]["fjssbInitData"];
                            xgmzg = body.SelectToken("qcs.jzxx.xgmzg");
                            nsrjbxx["tbrq"] = gd.tbrq;
                            fjssbInitData["sssq"]["rqQ"] = gd.skssqq;
                            fjssbInitData["sssq"]["rqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            setSfzzsxgmjz(xgmzg);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case Ywbm.qysds_a_18yjd:
                            nsrjbxx = (JObject)body["fq"]["nsrjbxx"];
                            JObject sssq = (JObject)body["fq"];
                            JToken sbQysdsczzsyjdsbqtxxVO = body.SelectToken("hq.sbQysdsczzsyjdsbqtxxVO");
                            nsrjbxx["tbrq"] = gd.tbrq;
                            sssq["sssq"]["sqQ"] = gd.skssqq;
                            sssq["sssq"]["sqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            setQysdsQcs(sbQysdsczzsyjdsbqtxxVO);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case Ywbm.cwbb_xqy_kjzz:
                            nsrjbxx = (JObject)body["qcs"]["djNsrxx"];
                            JObject ZlbssldjNsrxxVO = (JObject)body["ZlbssldjNsrxxVO"];
                            body["qcs"]["bsrq"] = gd.tbrq;
                            ZlbssldjNsrxxVO["ssqq"] = gd.skssqq;
                            ZlbssldjNsrxxVO["ssqz"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case Ywbm.xgmzzs:
                            nsrjbxx = (JObject)body["qcs"]["initData"]["nsrjbxx"];
                            JToken zzsxgmsbInitData = body["qcs"]["initData"]["zzsxgmsbInitData"];
                            zzsxgmsbInitData["sbrq"] = gd.tbrq;
                            zzsxgmsbInitData["sssq"]["rqQ"] = gd.skssqq;
                            zzsxgmsbInitData["sssq"]["rqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            setXgmzzsQcs(zzsxgmsbInitData);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case Ywbm.yhssb:
                            sbbhead = (JObject)body["yyssbbdxxVO"]["yhssb"]["sbbhead"];
                            xgmzg = body.SelectToken("qcs.jzxx.xgmzg");
                            sbbhead["sbrq1"] = gd.tbrq;
                            sbbhead["skssqq"] = gd.skssqq;
                            sbbhead["skssqz"] = gd.skssqz;
                            setYhsNsrxx(sbbhead);
                            setSfzzsxgmjz(xgmzg);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                    }
                }
            });
        }

        public async Task mainSetting(Ywbm ywbm, JToken input)
        {
            await Task.Run(() =>
            {
                switch (ywbm)
                {
                    case Ywbm.ybnsrzzsxbsz:
                        qc = repos.getUserYSBQC(Ywbm.ybnsrzzs.ToString());
                        dbData = repos.getUserYSBQCReportData(qc.Id, ywbm.ToString());
                        if (dbData.HasValues)
                        {
                            input["body"] = new JValue(JsonConvert.SerializeObject(dbData));
                        }
                        break;
                    case Ywbm.cwbbydy:
                        qc = repos.getUserYSBQC(Ywbm.cwbb_xqy_kjzz.ToString());
                        JObject body = JObject.Parse(input.SelectToken("body").Value<string>());
                        DateTime dt1 = DateTime.Parse(qc.SKSSQQ);
                        DateTime dt2 = DateTime.Parse(qc.SKSSQZ);
                        int ts = dt2.Month - dt1.Month;
                        if (ts != 2)
                        {
                            string msg = "税款所属期起：" + qc.SKSSQQ + "税款所属期止：" + qc.SKSSQZ + "不是季报";
                            Exception ex = new Exception(msg);
                            throw ex;
                        }
                        body["cwbbbsjcsz"]["sssqq"] = qc.SKSSQQ;
                        body["cwbbbsjcsz"]["sssqz"] = qc.SKSSQZ;
                        input["body"] = new JValue(JsonConvert.SerializeObject(body));
                        break;
                }
            });
        }

        void setNsrxx(JObject in_jo)
        {
            xx = repos.getNsrxx();
            in_jo["nsrmc"] = xx.NSRMC;
            in_jo["nsrsbh"] = xx.NSRSBH;
            in_jo["djzclxMc"] = xx.DJZCLX;
            in_jo["zcdz"] = xx.ZCDZ;
            in_jo["jydz"] = xx.SCJYDZ;
            in_jo["dhhm"] = xx.LXDH;
            in_jo["sshy"] = xx.GBHY;
            in_jo["hymc"] = xx.GBHY;
            in_jo["zgswskfjmc"] = xx.ZGDSSWJFJMC;
            in_jo["frxm"] = xx.Name;
            in_jo["ssglyMc"] = xx.Name;
            in_jo["fddbrsfzjhm"] = xx.IDCardNum;
            in_jo["zgswskfjDm"] = xx.ZGDSSWJFJMC;
        }

        void setYhsNsrxx(JObject in_jo)
        {
            xx = repos.getNsrxx();
            in_jo["nsrmc"] = xx.NSRMC;
            in_jo["nsrsbh"] = xx.NSRSBH;
            in_jo["djzclxMc"] = xx.DJZCLX;
            in_jo["zcdz"] = xx.ZCDZ;
            in_jo["jydz"] = xx.SCJYDZ;
            in_jo["lxdh"] = xx.LXDH;
            in_jo["sshy"] = xx.GBHY;
            in_jo["hyMc"] = xx.GBHY;
            in_jo["zgswskfjmc"] = xx.ZGDSSWJFJMC;
            in_jo["frxm"] = xx.Name;
            in_jo["sfzjhm"] = xx.IDCardNum;
        }

        void setYbnsrzzsEverySheet(IEnumerable<JToken> ijt)
        {
            xx = repos.getNsrxx();
            gd = repos.getGDTXDate(Ywbm.ybnsrzzs.ToString());
            foreach (JToken jt in ijt)
            {
                jt["nsrmc"] = xx.NSRMC;
                jt["nsrsbh"] = xx.NSRSBH;
                jt["skssqq"] = gd.skssqq;
                jt["skssqz"] = gd.skssqz;
            }
        }

        void setYbnsrzzsBnlj(JObject in_jo)
        {
            xx = repos.getNsrxx();
            //小规模纳税人期初数不设置
            if (xx.TaxPayerType == 2)
            {
                return;
            }

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(System.IO.File.ReadAllText(he.WebRootPath + "/business.xml"));
            JToken business = JsonConvert.DeserializeObject<JToken>(JsonConvert.SerializeXmlNode(doc));
            business = business.SelectToken("root.business").Where(a => a["type"].ToString() == xx.BusinessType.ToString()).ToList()[0];
            JObject zzsybnsrsbInitData_jo = JObject.Parse(System.IO.File.ReadAllText(he.WebRootPath + "/sbzs-cjpt-web/biz/sbzs/ybnsrzzs/zzsybnsrsbInitData." + business["value"] + ".json"));
            in_jo.Merge(zzsybnsrsbInitData_jo, new JsonMergeSettings { MergeArrayHandling = MergeArrayHandling.Union });
        }

        void setYbnsrzzsBnljAdditional(JArray input)
        {
            xx = repos.getNsrxx();
            //小规模纳税人期初数不设置
            if (xx.TaxPayerType == 2)
            {
                return;
            }

            if (xx.BusinessType == 1)//工业
            {
                input[1]["ynsejze"] = "330";
                input[1]["yshwxse"] = "13338803.25";
                input[1]["jxse"] = "1241460.94";
            }
            else if (xx.BusinessType == 2)//商业
            {
                input[1]["ynsejze"] = "280";
                input[1]["yshwxse"] = "2510538.05";
                input[1]["jxse"] = "219789.82";
            }
        }

        public string getSBCGMessage(int id)
        {
            qc = repos.getUserYSBQC(id);
            gd = repos.getGDTXDate(qc.ywbm);
            string str = "";
            Ywbm bm = Enum.Parse<Ywbm>(qc.ywbm);
            switch (bm)
            {
                case Ywbm.ybnsrzzs:
                case Ywbm.yhssb:
                case Ywbm.fjssb:
                case Ywbm.qysds_a_18yjd:
                    str = string.Format("您的税款所属期为{0}至{1}的{2}（应征凭证序号为：**********）已申报成功。税款金额：{3}元。", gd.skssqq, gd.skssqz, qc.TaskName, qc.SBSE);
                    break;
                case Ywbm.cwbb_xqy_kjzz:
                    str = string.Format("您所报送的所属期为{0}至{1}的《企业会计准则（一般企业）财务报表报送与信息采集》已成功提交给税务机关。", gd.skssqq, gd.skssqz);
                    break;
            }
            return str;
        }

        public Model getModel(string dm)
        {
            qc = repos.getUserYSBQC(dm);
            gd = repos.getGDTXDate(dm);
            xx = repos.getNsrxx();
            Model m = new Model { qc = qc, GDTXDate = gd, Nsrxx = xx };
            return m;
        }

        public Model getModel(int id)
        {
            qc = repos.getUserYSBQC(id);
            gd = repos.getGDTXDate(id);
            xx = repos.getNsrxx();
            Model m = new Model { qc = qc, GDTXDate = gd, Nsrxx = xx };
            return m;
        }

        public void getsbzf(JToken re_json)
        {
            JArray sbzfList = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["yzpzzlmc"] = item.TaskName;
                item_jo["sbrq"] = item.HappenDate;
                item_jo["skssqq"] = item.SKSSQQ;
                item_jo["skssqz"] = item.SKSSQZ;
                item_jo["ybtse"] = item.SBSE;
                item_jo["sbqdzf"] = "N";
                item_jo["sbfsDm"] = "32";
                item_jo["pzxh"] = item.Id;
                item_jo["gdslxDm"] = "1";
                item_jo["yzpzzlDm"] = item.yzpzzlDm;
                item_jo["zsxmDm"] = "";
                item_jo["zsxmmc"] = "";
                item_jo["sbfsmc"] = "网络申报";
                sbzfList.Add(item_jo);
            }
            re_json["sbzfList"] = sbzfList;
        }

        public void getsbzfmx(int id, JObject in_jo)
        {
            JArray out_ja = new JArray();
            qc = repos.getUserYSBQC(id);
            dbData = repos.getUserYSBQCReportData(qc.Id, qc.ywbm);

            JObject jo = new JObject();
            JObject jo2 = new JObject();
            JObject jo3 = new JObject();
            Sbzfmx mx;
            Ywbm ywbm = Enum.Parse<Ywbm>(qc.ywbm.ToLower());
            switch (ywbm)
            {
                case Ywbm.ybnsrzzs:
                    jo.Add("zsxmDm", "10101");
                    jo.Add("skssqq", qc.SKSSQQ);
                    jo.Add("gdslxDm", "1");
                    jo.Add("sl1", "0.06");
                    jo.Add("pzxh", "10011119000006167259");
                    jo.Add("pzmxxh", "1");
                    jo.Add("zspmmc", "咨询服务");
                    jo.Add("ybtse", "0");
                    jo.Add("ynse", "");
                    jo.Add("skssqz", qc.SKSSQZ);
                    jo.Add("zsxmmc", "增值税");
                    jo.Add("zspmDm", "101016703");
                    out_ja.Add(jo);
                    jo2 = (JObject)jo.DeepClone();
                    jo2["sl1"] = "0.13";
                    jo2["pzmxxh"] = "2";
                    jo2["zspmmc"] = "商业(17%、16%)";
                    jo2["zspmDm"] = "101014001";
                    jo2["ybtse"] = qc.SBSE;
                    out_ja.Add(jo2);
                    break;
                case Ywbm.fjssb:
                    JToken sbxxGridlbVO = dbData.SelectToken("fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO");

                    jo.Add("zsxmDm", "10109");
                    jo.Add("skssqq", qc.SKSSQQ);
                    jo.Add("gdslxDm", "2");
                    jo.Add("sl1", "0.07");
                    jo.Add("pzxh", "10021119000009000150");
                    jo.Add("pzmxxh", "1");
                    jo.Add("zspmmc", "市区（增值税附征）");
                    jo.Add("skssqz", qc.SKSSQZ);
                    jo.Add("zsxmmc", "城市维护建设税");
                    jo.Add("zspmDm", "101090101");
                    JToken bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    JToken bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo.Add("ybtse", bqybtse.Value<string>());
                    jo.Add("ynse", bqynsfe.Value<string>());
                    out_ja.Add(jo);

                    jo2 = (JObject)jo.DeepClone();
                    jo2["zsxmDm"] = "30203";
                    jo2["sl1"] = "0.03";
                    jo2["pzmxxh"] = "2";
                    jo2["zspmmc"] = "增值税教育费附加";
                    jo2["zsxmmc"] = "教育费附加";
                    jo2["zspmDm"] = "302030100";
                    bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo2["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo2["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo2["ybtse"] = bqybtse.Value<string>();
                    jo2["ynse"] = bqynsfe.Value<string>();
                    out_ja.Add(jo2);

                    jo3 = (JObject)jo.DeepClone();
                    jo3["zsxmDm"] = "30216";
                    jo3["sl1"] = "0.02";
                    jo3["pzmxxh"] = "3";
                    jo3["zspmmc"] = "增值税地方教育附加";
                    jo3["zsxmmc"] = "地方教育附加";
                    jo3["zspmDm"] = "302160100";
                    bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo3["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo3["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo3["ybtse"] = bqybtse.Value<string>();
                    jo3["ynse"] = bqynsfe.Value<string>();
                    out_ja.Add(jo3);
                    break;
                case Ywbm.qysds_a_18yjd:
                    JToken sbbxxForm = dbData.SelectToken("ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm");
                    mx = new Sbzfmx();
                    mx.zsxmDm = "10101";
                    mx.skssqq = qc.SKSSQQ;
                    mx.gdslxDm = "1";
                    mx.sl1 = "0.25";
                    mx.pzxh = qc.Id.ToString();
                    mx.pzmxxh = "1";
                    mx.zspmmc = "应纳税所得额";
                    mx.ybtse = qc.SBSE;
                    mx.ynse = sbbxxForm["ynsdseLj"].ToString();
                    mx.skssqz = qc.SKSSQZ;
                    mx.zsxmmc = "企业所得税";
                    mx.zspmDm = "101040001";
                    jo = JObject.Parse(JsonConvert.SerializeObject(mx));
                    out_ja.Add(jo);
                    break;
                case Ywbm.cwbb_xqy_kjzz:
                    mx = new Sbzfmx();
                    mx.zsxmDm = "";
                    mx.skssqq = qc.SKSSQQ;
                    mx.gdslxDm = "1";
                    mx.sl1 = "";
                    mx.pzxh = qc.Id.ToString();
                    mx.pzmxxh = "1";
                    mx.zspmmc = qc.TaskName;
                    mx.ybtse = qc.SBSE;
                    mx.ynse = "";
                    mx.skssqz = qc.SKSSQZ;
                    mx.zsxmmc = "财务报表";
                    mx.zspmDm = "";
                    jo = JObject.Parse(JsonConvert.SerializeObject(mx));
                    out_ja.Add(jo);
                    break;
            }
            in_jo["sbzfMxList"] = out_ja;
        }

        public void sbZfSubmit(int id)
        {
            repos.sbZfSubmit(id);
        }

        public void UpdateSBZT(int id, string sbzt)
        {
            repos.UpdateSBZT(id, sbzt);
        }

        public void reset(string dm)
        {
            repos.reset(dm);
        }

        public async Task setYbnsrzzsXbsz(JArray retJarr)
        {
            await Task.Run(() =>
            {
                qc = repos.getUserYSBQC(Ywbm.ybnsrzzs.ToString());
                dbData = repos.getUserYSBQCReportData(qc.Id, Ywbm.ybnsrzzsxbsz.ToString());
            });
            if (!dbData.HasValues)
            {
                return;
            }
            JObject jcxxsz = (JObject)dbData["jcxxsz"];
            for (int i = retJarr.Count - 1; i >= 0; i--)
            {
                JToken jt = jcxxsz.SelectToken(retJarr[i]["dzbdbm"].ToString());
                if (jt.ToString() == "N")
                {
                    retJarr.RemoveAt(i);
                }
            }
        }

        public async Task aqsb_getSbqcList(JObject retJobj, string type = "enterSbqc")
        {
            if (type == "oneRefresh")
            {
                return;
            }
            JArray out_ja = new JArray();
            List<GDTXUserYSBQC> ysbqclist = await Task.Run(() =>
               {
                   return repos.getUserYSBQC();
               });
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject jo = new JObject();
                if (item.SBZT == SBZT.YSB)
                {
                    jo.Add("sbztDm", "210");
                    jo.Add("sbrq", item.HappenDate);
                }
                else
                {
                    jo.Add("sbztDm", "");
                    jo.Add("sbrq", "");
                }
                Ywbm ywbm = Enum.Parse<Ywbm>(item.ywbm.ToLower());
                switch (ywbm)
                {
                    case Ywbm.ybnsrzzs:
                        jo.Add("zsxmDm", "10101");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "06");
                        jo.Add("zsxmMc", "增值税(适用于一般纳税人)");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("lastzs", "Y");
                        jo.Add("yzpzzlDm", "BDA0610606");
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "");
                        jo.Add("zspmDm", "101014001");
                        out_ja.Add(jo);
                        break;
                    case Ywbm.fjssb:
                        jo.Add("zsxmDm", "30216");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "06");
                        jo.Add("zsxmMc", "地方教育附加");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("yzpzzlDm", "BDA0610678");
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "增值税地方教育附加");
                        jo.Add("zspmDm", "302160100");
                        out_ja.Add(jo);
                        JObject jo2 = (JObject)jo.DeepClone();
                        jo2["zsxmDm"] = "30203";
                        jo2["zsxmMc"] = "教育费附加";
                        jo2["zspmMc"] = "增值税教育费附加";
                        jo2["zspmDm"] = "302030100";
                        out_ja.Add(jo2);
                        JObject jo3 = (JObject)jo.DeepClone();
                        jo3["zsxmDm"] = "10109";
                        jo3["zsxmMc"] = "城市维护建设税";
                        jo3["zspmMc"] = "市区（增值税附征）";
                        jo3["zspmDm"] = "101090101";
                        out_ja.Add(jo3);
                        break;
                    case Ywbm.qysds_a_18yjd:
                        jo.Add("zsxmDm", "10104");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "08");
                        jo.Add("zsxmMc", "企业所得税(月季报)");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("lastzs", "Y");
                        jo.Add("yzpzzlDm", "BDA0611033");
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "应纳税所得额");
                        jo.Add("zspmDm", "101040001");
                        out_ja.Add(jo);
                        break;
                    case Ywbm.cwbb_xqy_kjzz:
                        getSbqcCwbb(retJobj, item);
                        break;
                }
            }
            retJobj["sbqcList"] = out_ja;
        }

        private void getSbqcCwbb(JObject retJobj, GDTXUserYSBQC item)
        {
            JObject jo = new JObject();
            jo["bsqx"] = item.SBQX;
            jo["gdslxDm"] = "1";
            jo["sbztDm"] = "000";
            jo["bsrq"] = item.SBZT == SBZT.YSB ? item.HappenDate : "";
            jo["url"] = item.Url;
            jo["gdsbz"] = "gs";
            jo["bsssqQ"] = item.SKSSQQ;
            jo["bsssqZ"] = item.SKSSQZ;
            jo["cwbsxlmc"] = "小企业会计准则财务报表与信息采集";
            jo["bbbsqDm"] = "3";
            jo["cwkjzd"] = "小企业会计准则";
            jo["cwkjzdDm"] = "101";
            jo["cwbsxlDm"] = "ZL1001001";
            retJobj["cwbbList"][0] = jo;
        }

        public void getSbxxcx(JObject re_json)
        {
            JArray sbList = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["id"] = item.Id;
                item_jo["pzxh"] = item.Id;
                item_jo["gdslxDm"] = "1";
                item_jo["showType"] = "1";
                item_jo["ywbm"] = item.ywbm.ToUpper();
                item_jo["version"] = "1";
                item_jo["sbzfbz"] = "N";
                item_jo["yzpzzlmc"] = item.TaskName;
                item_jo["zsxmmc"] = item.ZSXM;
                item_jo["sbrq"] = item.HappenDate;
                item_jo["skssqq"] = item.SKSSQQ;
                item_jo["skssqz"] = item.SKSSQZ;
                item_jo["ybtse"] = item.SBSE;
                sbList.Add(item_jo);
            }
            re_json["sbxxList"] = sbList;
        }

        public void query(JObject re_json)
        {
            JArray ysbxx = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["gdslx"] = "国地税";
                item_jo["zsxmmc"] = item.ZSXM;
                item_jo["zspmmc"] = item.ZSXM;
                item_jo["dzbzdszlmc"] = item.TaskName;
                item_jo["sbrq_1"] = item.HappenDate;
                item_jo["sbqx"] = item.SBQX;
                item_jo["skssqq"] = item.SKSSQQ;
                item_jo["skssqz"] = item.SKSSQZ;
                item_jo["ysx"] = "";
                item_jo["ynse"] = "";
                item_jo["jmse"] = "";
                item_jo["yjse"] = "";
                item_jo["ybtse"] = item.SBSE;
                ysbxx.Add(item_jo);
            }
            JToken taxML = re_json["taxML"]["body"]["taxML"];
            taxML["ysbxxList"]["ysbxx"] = ysbxx;
            taxML["yqwsbxxList"] = new JObject();
            taxML["yqwsbxxList"]["yqwsbxx"] = new JArray();
        }

        public void formatCd(JObject in_jo)
        {
            JToken ja = in_jo.SelectToken("menus.yhGncds[1].yhGncds");
            IEnumerable<JToken> yhGncds = ja.Where(a => a["cdmc"].ToString() != "公众服务");
            foreach (JObject jo in yhGncds)
            {
                JToken ja2 = jo["yhGncds"];
                IEnumerable<JToken> ijt = ja2.Where(a => a["cdmc"].ToString() != "税费申报及缴纳" && a["cdmc"].ToString() != "申报信息查询");
                foreach (JObject jo2 in ijt)
                {
                    JToken jp = jo2.Property("realUrl");
                    if (jp != null)
                    {
                        jp.Remove();
                    }
                }
            }

            JToken jt = ja.Where(a => a["cdmc"].ToString() == "公众服务").First();
            foreach (JObject jo in jt["yhGncds"])
            {
                foreach (JObject jo2 in jo["yhGncds"])
                {
                    JToken jp = jo2.Property("realUrl");
                    if (jp != null)
                    {
                        jp.Remove();
                    }
                }
            }
        }

        public void enterQtsb(JObject input)
        {
            gd = repos.getGDTXDate(Ywbm.fjssb.ToString());
            input["qtsbList"][0]["skssqQ"] = gd.tbrq;
            input["qtsbList"][0]["skssqZ"] = gd.tbrq;
        }

        public void getSsqz(JObject re_json)
        {
            gd = repos.getGDTXDate(Ywbm.fjssb.ToString());
            re_json["sbrqq"] = gd.sbrqq;
            re_json["sbrqz"] = gd.sbrqz;
        }

        public void setHeadNsrxx(JObject in_jo)
        {
            xx = repos.getNsrxx();
            in_jo["yhqymc"] = xx.NSRMC;
            in_jo["userName"] = xx.NSRSBH;
        }

        private void setSfzzsxgmjz(JToken input)
        {
            xx = repos.getNsrxx();
            if (xx.TaxPayerType == 1)
            {
                input["sfzzsxgmjz"] = "N";
            }
            else if (xx.TaxPayerType == 2)
            {
                input["sfzzsxgmjz"] = "Y";
            }
        }

        private void setQysdsQcs(JToken input)
        {
            xx = repos.getNsrxx();
            //小规模纳税人期初数不设置
            if (xx.TaxPayerType == 2)
            {
                return;
            }
            if (xx.BusinessType == 1)//工业
            {
                input["yyyjje"] = "76376.11";
            }
            else if (xx.BusinessType == 2)//商业
            {
                input["yyyjje"] = "2982.85";
            }
        }

        private void setXgmzzsQcs(JToken input)
        {
            input["wdqzd"] = "100000";
            //input["zzsxgmnsrQzd"] = "300000";
            //input["zzsxgmnsrYsfwQzd"] = "300000";
        }

        public async Task xSheets(Ywbm bm, JArray input)
        {
            switch (bm)
            {
                case Ywbm.ybnsrzzs:
                    await setYbnsrzzsXbsz(input);
                    break;
            }
        }

        public void getDbsx(JToken input)
        {
            gd = repos.getGDTXDate(Ywbm.fjssb.ToString());
            JToken item = input["items"][0];
            item["dbsj"] = gd.sbrqz;
            item["txbt"] = "您有未申报的税种（截止" + gd.sbrqz + "）";
        }

        public JObject getSubMenus(List<string> param, string m1)
        {
            JObject jo;
            switch (m1)
            {
                case "sbjs":
                case "sscx":
                    param.Add(m1);
                    jo = set.GetJsonObject(param);
                    break;
                default:
                    param.Clear();
                    param.Add("VirtualSubMenus");
                    jo = set.GetJsonObject(param);
                    CreateVirtualSubMenus(jo, m1);
                    break;
            }
            return jo;
        }

        private void CreateVirtualSubMenus(JObject input, string m1)
        {
            input["menus"]["cdtb"] = m1;
        }

    }
}
