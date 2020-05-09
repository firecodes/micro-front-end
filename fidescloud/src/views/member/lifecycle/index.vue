<template>
  <div>
    <div class="lifecyclePage">
      <cycle v-for="(item, idx) in cycleList" :key="idx" :content="item"></cycle>
    </div>
  </div>
</template>

<script>
import Cycle from './cycle'
export default {
  components: {
    Cycle
  },
  data() {
    return {
      cycleList: [
        {
          title: 'Prospect buyers',
          nums: null,
          date: 'Last update: 31/10/2019',
          desc: 'A group of members who haven’t made a purchase',
          none: true
        },
        {
          title: 'New buyers',
          nums: null,
          date: 'Last update: 30/10/2019',
          desc: 'A group of members who only have a purchase and this purchase occurred in recent one year.',
          none: true
        },
        {
          title: 'Repeat buyers',
          nums: null,
          date: 'Last update: 30/10/2019',
          desc: 'A group of members who have three purchases in recent one year at least.',
          none: true
        },
        {
          title: 'Loyal members',
          nums: '15,000',
          date: 'Last update: 31/10/2019',
          desc: 'A group of members who had purchases in recent three months and more than ten purchases in total.',
          none: false
        },
        {
          title: 'Lapsed members',
          nums: '1,999',
          date: 'Last update: 30/10/2019',
          desc: 'A group of members whose last purchase occurred at one year ago.',
          none: false
        },
        {
          title: 'Sleeping members',
          nums: '100,000',
          date: 'Last update: 30/10/2019',
          desc: 'A group of members who have not made any purchase during last three years.',
          none: false
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.lifecyclePage {
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > div {
    margin-bottom: 50px;
  }
}
</style>
