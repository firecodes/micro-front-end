<!--
  KPI 定义
-->
<template>
  <div class="kpi-definition">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="Dashboard Screenshot" prop="name" width="820">
        <template slot-scope="scope">
          <template v-if="scope.$index === 0">
            <img :src="require('@/assets/images/kpi-definition/FC_HP_Dashboard.png')" style="width: 820px; height: 717px; position: absolute;left: 0;top: 0;" />
          </template>
          <template v-else-if="scope.$index == 1">
            <img :src="require('@/assets/images/kpi-definition/FC_MEM_VIEW_1.png')" style="width: 820px; height: 717px; position: absolute;left: 0;top: 0;" />
            <img :src="require('@/assets/images/kpi-definition/FC_MEM_VIEW_2.png')" style="width: 820px; height: 717px; margin-top: 717px; margin-left: -10px;" />
          </template>
          <template v-else-if="scope.$index == 2">
            <img :src="require('@/assets/images/kpi-definition/Image 2.png')" style="width: 820px; height: 390px; position: absolute;left: 0;top: 0;" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="KPI definition" prop="name">
        <template slot-scope="scope">
          <div style="padding: 10px;" v-html="scope.row.value"></div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [{
          name: '', value: '<ol style="list-style-type: decimal;">\n' +
            '<li>Member|会员<br />\n' +
            '<ol style="list-style-type: lower-alpha;">\n' +
            '<li>Total Member | 总会员数量<br />\n' +
            '<ol style="list-style-type: lower-roman;">\n' +
            '<li>The number of total active number at current date | 当前日期总的会员有效会员数</li>\n' +
            '<li>The rate of new member | 新会员比例<br />New member: register in current month. | The average of purchase frequency among all the members 当月注册的新会员<br />Formula:&nbsp; the number of new member/the number of total member | 当月新会员数量除以当前时间总会员数</li>\n' +
            '<li>The rate of exsiting member | 已有会员比例<br />Existing member : register before this month. | 已有会员：当月之前入会的会员<br />Formula: the number of exsiting member/the number of total member | 已有会员数除以当前时间总会员数</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Activity Rate: the percentage of member purchased in past 12 months. | 活跃率:12个月内有购买的会员占总会员的比例<br />\n' +
            '<ol style="list-style-type: lower-roman;">\n' +
            '<li>Formula : the numbers of members purchase in past 12 months divide the total member. | 公式 ： 活跃会员人数除以总会员数</li>\n' +
            '<li>Tier segment: by each tier the activity rate | 各个当前级别的会员活跃率， 公式：当前级别活跃会员人数除以当前在级别的会员总人数</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Frequency | 购买频次\n' +
            '<ol style="list-style-type: lower-roman;">\n' +
            '<li>P12M menas to rolling last 12 months since current months. | P12M是指向前推12个月。公式 ： 向前推12个月会员总交易笔数 / 向前推12个月会员购买人数.Eg : 当前时间是2019-10-17，统计时间为：2018-10-17 ~ 2019-10-16</li>\n' +
            '<li>Last year | 上一个自然年, 公式 ：去年会员总交易笔数 / 去年会员购买人数 ,统计时间为：2018-01-01 ~ 2018-12-31</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Sales | 销售（按照年份统计）<br />\n' +
            '<ol style="list-style-type: lower-alpha;">\n' +
            '<li>Total Sales | 总销售<br />All the client\'s sales in this selective year. | 包括会员和非会员的总销售</li>\n' +
            '<li>Member Sales | 会员销售<br />Only member sales in this selective year. | 当前年份会员销售金额</li>\n' +
            '<li>Average Basket | 客单价<br />the average AB for all transaction.(include member and non-member\'s transaction) | 不区分会员和非会员，总交易金额除以总交易笔数</li>\n' +
            '<li>Average Items | 客单件<br />the average AI for all transaction.(include member and non-member\'s transaction) | 不区分会员和非会员，总交易件数除以交易笔数</li>\n' +
            '<li>Member Transactions | 会员交易<br />In each month , total amount of member transaction. | 当前年份的每个月，会员交易的统计值。</li>\n' +
            '<li>VS last month and VS last year | 各个指标与上一年、上一月对比<br />"Last month" means the same date period of last month| 去年同月份的相同截止日期<br />e.g, the current date is "2018/9/18" , the KPIs will be compared with last monthof "9/1"~"9/18". |&nbsp; 例如，当前是9月18日，比较8月1日到8月18日的同期数据。<br />&ldquo;Last year&rdquo; means the same date period of last year.<br />e.g, the current date is "2018/9/18" ,the KPIs will be compared with last year of "2017/9/1~2017/9/18".</li>\n' +
            '<li>Monthly for the "Total Sales","Member Sales","Average Basket","Average Items" in below chart.</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Campaign | 活动 （按照年份统计）<br />\n' +
            '<ol style="list-style-type: lower-alpha;">\n' +
            '<li>Campaign Sales | 活动销售<br />The campaign related total sales in this selective year. | 当前活动总关联销售金额（参与活动的总交易金额）</li>\n' +
            '<li>Campaign Number | 活动数量<br />The counts of campaing in this selective year. | 当年已经创建的活动数量</li>\n' +
            '<li>Participants | 活动参与率<br />The numbers of member who has participant with the campaign. |&nbsp; 活动参与人数（多倍积分需要购买才算参与，沟通活动只要在活动期间购买了就算参与）</li>\n' +
            '<li>Response Rate | 响应率<br />The rate of members who have been participant with the campaign. | 参与活动会员的比率<br />Formal : the number of member participant / the number of campaign targets | 参与活动的人数除以活动总的目标人数<br /><br /></li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>N/A</li>\n' +
            '</ol>'
        }, {
          name: '', value: '<ol style="list-style-type: decimal;">\n' +
            '<li>Transaction&rarr;Overall | 会员交易--&gt;汇总<br />\n' +
            '<ol>\n' +
            '<li>Average Items | 客单件<br />Formal : total items of transaction/total counts of transaaction | 该会员的总交易件数除以总交易笔数</li>\n' +
            '<li>Average basket | 客单价<br />Formal : total amount of transaction/total counts of transaaction | 该会员的总交易金额除以交易笔数</li>\n' +
            '<li>Accumulative payment | 累计消费金额<br />Formal : total amount of transaction | 该会员总交易金额</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Transaction&rarr;RFM | RFM数据<br />\n' +
            '<ol>\n' +
            '<li>Member\'s Recency <br />the number of months that have passed since the customer last purchased | 距离最近一次购买的间隔月份</li>\n' +
            '<li>Member\'s Frequency<br />the number of purchases by the member in the last 12 months | 该会员最近12个月购买的交易笔数</li>\n' +
            '<li>Member\'s Montary Value</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Transaction--&gt;RFM--&gt;{member} / {tenant}<br />Campare the member\'s KPI with the tenant\'s. |&nbsp; 比较租户的和当前会员的RFM数据<br />\n' +
            '<ol>\n' +
            '<li>Tenant\'s Recency <br />the average number of months that have passed since the member last purchased | 所有会员的、距离最近一次购买的间隔月份的平均值</li>\n' +
            '<li>Tenant\'s Frequency<br />the average number of purchases by the member in the last 12 months | 该租户所有会员、最近12个月购买的交易笔数的平均数</li>\n' +
            '<li>Tenant\'s Montary Value<br />the averaget figures of member total purchase | 该租户所有会员消费金额的平均数</li>\n' +
            '</ol>\n' +
            '</li>\n' +
            '<li>Member Transaction<br />The purchase\'s amount of member in every month.Both in this year and&nbsp; last year | 会员当年每个月的交易金额，当年与去年</li>\n' +
            '<li>Recent purchase date <br />The member latest purchase date.<br />会员最近购买时间</li>\n' +
            '</ol><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />'
        }, {
          name: '', value: '<p>For every campaign it will be calcuated the effectiveness daily. The KPIs are described as following .</p>\n' +
            '<ol style="list-style-type: decimal;">\n' +
            '<li>Number of contacts | 目标人数<br />Number of member in target groups, not including control group. | 这个指标是指活动目标组的人数，不含控制组。</li>\n' +
            '<li>Additional sales | 销售额增加<br />Additional sales because of this campaign. | 这个指标是指活动带来的额外交易额。（参与活动具体交易的总金额）</li>\n' +
            '<li>Return Rate | 购买率<br />Transaction during campaign period and stores divided by number of contacts. | 这个指标是指目标客户在活动期间和活动地点发生的交易的数量除以目标组的人数。</li>\n' +
            '<li>Visit effect | 由购买率引起的销售额<br />Additional sales contributed by return rate . | 这个指标是指由于Return Rate的增加，导致的额外交易额。（参加活动会员，在活动期间的总购买金额）</li>\n' +
            '<li>Average Basket | 平均客单价<br />The average sales amount per transaction. | 这个指标是指目标客户每笔交易的金额。（参加该活动的交易客单价）</li>\n' +
            '<li>AB effect | 由平均篮引起的销售额增加<br />Additional sales contributed by AB increase. | 这个指标是指由于AB的增加，导致的额外交易额。（活动额外客单价减去平均客单价，在乘以活动交易笔数）</li>\n' +
            '</ol>\n'
        }]
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .kpi-definition{
    margin: 25px;
    background-color: #ffffff;
    /deep/ li{
      list-style: inherit!important;
      list-style-position: outside!important;
    }
    /deep/ ol{
      list-style:disc inside none;
      margin-left: 2em;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #ffffff;
    }
    /deep/ .el-table--border th .cell{
      color: #000000;
      font-weight: 600;
    }
  }
</style>
