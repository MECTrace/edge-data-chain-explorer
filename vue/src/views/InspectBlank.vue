<template>
  <div id="page-inspectBlank">
    <v-container  mt-12>
      <v-row class="text-center" align="center" justify="center">
        <v-col cols="12">
          Use the search box to inspect an item.
        </v-col>
        <v-col cols="12" sm="9" md="8">
          <img width="100%" src="../../public/search_help.png"/>
        </v-col>
        <v-col cols="12" sm="9" md="8" align="start">
          Enter search string in the form of <b>type:search key</b>.<br/>
          For example, <b>block:2345</b> to search a block with the height 2345.<br/>
          Available types are as follows:<br/>
          <ul>
            <li>block: search a block with block height</li>
            <li>account: search an account with address</li>
            <li>tx: search a transaction with tx hash</li>
            <li>validator: search a validator with address</li>
          </ul>
        </v-col>
        <v-col cols="12" sm="9" md="8" align="start">
          검색어를 <b>type:검색대상</b>의 형태로 입력하세요.<br/>
          예를 들어 번호가 2345인 블록을 검색하기 위해서는 <b>block:2345</b>를 입력합니다.<br/>
          사용할 수 있는 type들은 다음과 같습니다:<br/>
          <ul>
            <li>block: 블록 번호로 블록 검색</li>
            <li>account: 주소로 계정 검색</li>
            <li>tx: tx hash로 거래 검색</li>
            <li>validator: 주소로 validator 검색</li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

</style>
