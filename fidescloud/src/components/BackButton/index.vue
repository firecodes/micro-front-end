<template>
  <button @click.stop="goBack"><< {{$t('member.fc_member_details_social_btn_back_label')}}</button>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  $button-bg-color: $primary;
  button{
    cursor: pointer;
    color: #ffffff;
    min-width: 80px;
    height: 30px;
    border-radius: 4px;
    background-color: $button-bg-color;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    text-align: center;
    border: 1px solid $button-bg-color;
  }
</style>
