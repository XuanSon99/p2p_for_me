<template>
  <main>
    <div class="ma-8">
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-card-title class="pb-0">
              <span class="buy">Mua</span>
              <v-btn class="ml-3" outlined v-if="settings.amount_sell">
                {{ formatPrice(settings.amount_sell) }}
              </v-btn>
              <v-btn class="ml-3" color="orange" outlined @click="checkOrder" v-if="settings.sell_order">{{
                settings.sell_order }}
                orders</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mr-3" :href="'https://p2p.binance.com/vi/advEdit?code=' + this.settings.sell_id"
                target="_blank" outlined>Sửa QC</v-btn>
              <v-btn class="primary mr-3" width="150">
                Refresh:
                <span v-if="refresh == 0">
                  <v-progress-circular :width="3" :size="13" color="white" indeterminate></v-progress-circular>
                </span>
                <span v-else>{{ refresh }}</span>
              </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="buy_data" :hide-default-footer="true">
              <template v-slot:[`item.name`]="{ item }">
                <div class="align-center d-flex name mb-1" @click="editAdv(item.adv.advNo)">
                  <span class="mr-1">{{ item.advertiser.nickName }}</span>
                  <img src="/img/authentication_icon.svg" alt="" v-if="item.adv.classify == 'profession'">
                </div>
                <div class="overview">
                  <span class="mr-2">{{ formatVNPrice(item.advertiser.monthOrderCount) }} lệnh</span>
                  <span>{{ toFixedValue(item.advertiser.monthFinishRate * 100) }}% hoàn tất</span>
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="price">{{ formatVNPrice(item.adv.price) }} <span>VND</span></div>
              </template>
              <template v-slot:[`item.limit`]="{ item }">
                <div class="limit">
                  <div class="mb-1">Khả dụng: <b>{{ formatPrice(item.adv.tradableQuantity) }} USDT</b></div>
                  <div>
                    <span>Giới hạn: <b>₫{{ formatPrice(item.adv.minSingleTransAmount) }}</b></span>
                    -
                    <span>
                      <b>₫{{ formatPrice(item.adv.dynamicMaxSingleTransAmount) }}</b>
                    </span>
                  </div>
                </div>
              </template>
              <template v-slot:[`item.payments`]="{ item }">
                <div class="payments" v-for="(method, index) in item.adv.tradeMethods.slice(0, 1)" :key="index"
                  :style="{ color: method.tradeMethodBgColor }">
                  {{ method.tradeMethodName }}
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title class="pb-0">
              <span class="sell">Bán</span>
              <v-btn class="ml-3" outlined v-if="settings.amount_buy">
                {{ formatPrice(settings.amount_buy) }}
              </v-btn>
              <v-btn class="ml-3" color="orange" outlined @click="checkOrder" v-if="settings.buy_order">{{
                settings.buy_order }}
                orders</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mr-3" :href="'https://p2p.binance.com/vi/advEdit?code=' + this.settings.buy_id"
                target="_blank" outlined>Sửa QC</v-btn>
              <v-btn class="primary mr-3" width="150" @click="dialog = true">Cài đặt</v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="sell_data" :hide-default-footer="true">
              <template v-slot:[`item.name`]="{ item }">
                <div class="align-center d-flex name mb-1" @click="editAdv(item.adv.advNo)">
                  <span class="mr-1">{{ item.advertiser.nickName }}</span>
                  <img src="/img/authentication_icon.svg" alt="" v-if="item.adv.classify == 'profession'">
                </div>
                <div class="overview">
                  <span class="mr-2">{{ formatVNPrice(item.advertiser.monthOrderCount) }} lệnh</span>
                  <span>{{ toFixedValue(item.advertiser.monthFinishRate * 100) }}% hoàn tất</span>
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="price">{{ formatVNPrice(item.adv.price) }} <span>VND</span></div>
              </template>
              <template v-slot:[`item.limit`]="{ item }">
                <div class="limit">
                  <div class="mb-1">Khả dụng: <b>{{ formatPrice(item.adv.tradableQuantity) }} USDT</b></div>
                  <div>
                    <span>Giới hạn: <b>₫{{ formatPrice(item.adv.minSingleTransAmount) }}</b></span>
                    -
                    <span>
                      <b>₫{{ formatPrice(item.adv.dynamicMaxSingleTransAmount) }}</b>
                    </span>
                  </div>
                </div>
              </template>
              <template v-slot:[`item.payments`]="{ item }">
                <div class="payments" v-for="(method, index) in item.adv.tradeMethods.slice(0, 1)" :key="index"
                  :style="{ color: method.tradeMethodBgColor }">
                  {{ method.tradeMethodName }}
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-data-table :headers="headers" :items="buy_top" :hide-default-footer="true" :hide-default-header="true">
              <template v-slot:[`item.name`]="{ item }">
                <div class="align-center d-flex name mb-1" @click="editAdv(item.adv.advNo)">
                  <span class="mr-1">{{ item.advertiser.nickName }}</span>
                  <img src="/img/authentication_icon.svg" alt="" v-if="item.adv.classify == 'profession'">
                </div>
                <div class="overview">
                  <span class="mr-2">{{ formatVNPrice(item.advertiser.monthOrderCount) }} lệnh</span>
                  <span>{{ toFixedValue(item.advertiser.monthFinishRate * 100) }}% hoàn tất</span>
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="price">{{ formatVNPrice(item.adv.price) }} <span>VND</span></div>
              </template>
              <template v-slot:[`item.limit`]="{ item }">
                <div class="limit">
                  <div class="mb-1">Khả dụng: <b>{{ formatPrice(item.adv.tradableQuantity) }} USDT</b></div>
                  <div>
                    <span>Giới hạn: <b>₫{{ formatPrice(item.adv.minSingleTransAmount) }}</b></span>
                    -
                    <span>
                      <b>₫{{ formatPrice(item.adv.dynamicMaxSingleTransAmount) }}</b>
                    </span>
                  </div>
                </div>
              </template>
              <template v-slot:[`item.payments`]="{ item }">
                <div class="payments" v-for="(method, index) in item.adv.tradeMethods.slice(0, 1)" :key="index"
                  :style="{ color: method.tradeMethodBgColor }">
                  {{ method.tradeMethodName }}
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-data-table :headers="headers" :items="sell_top" :hide-default-footer="true" :hide-default-header="true">
              <template v-slot:[`item.name`]="{ item }">
                <div class="align-center d-flex name mb-1" @click="editAdv(item.adv.advNo)">
                  <span class="mr-1">{{ item.advertiser.nickName }}</span>
                  <img src="/img/authentication_icon.svg" alt="" v-if="item.adv.classify == 'profession'">
                </div>
                <div class="overview">
                  <span class="mr-2">{{ formatVNPrice(item.advertiser.monthOrderCount) }} lệnh</span>
                  <span>{{ toFixedValue(item.advertiser.monthFinishRate * 100) }}% hoàn tất</span>
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="price">{{ formatVNPrice(item.adv.price) }} <span>VND</span></div>
              </template>
              <template v-slot:[`item.limit`]="{ item }">
                <div class="limit">
                  <div class="mb-1">Khả dụng: <b>{{ formatPrice(item.adv.tradableQuantity) }} USDT</b></div>
                  <div>
                    <span>Giới hạn: <b>₫{{ formatPrice(item.adv.minSingleTransAmount) }}</b></span>
                    -
                    <span>
                      <b>₫{{ formatPrice(item.adv.dynamicMaxSingleTransAmount) }}</b>
                    </span>
                  </div>
                </div>
              </template>
              <template v-slot:[`item.payments`]="{ item }">
                <div class="payments" v-for="(method, index) in item.adv.tradeMethods.slice(0, 1)" :key="index"
                  :style="{ color: method.tradeMethodBgColor }">
                  {{ method.tradeMethodName }}
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Cài đặt
        </v-card-title>
        <v-divider></v-divider>
        <div class="mx-6 mt-6">
          <v-text-field label="Quảng cáo bán" v-model="settings.sell_id" outlined></v-text-field>
          <v-text-field label="Quảng cáo mua" v-model="settings.buy_id" outlined></v-text-field>
        </div>
        <v-divider></v-divider>
        <div class="mx-6 mt-6">
          <v-text-field label="Lệnh mua từ" v-model="settings.buy_search" outlined></v-text-field>
          <v-text-field label="Lệnh bán từ" v-model="settings.sell_search" outlined></v-text-field>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Hủy
          </v-btn>
          <v-btn color="blue darken-1" text @click="settingSave">
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>

export default {
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: 'Tên',
          value: 'name',
          sortable: false
        },
        { text: 'Giá', value: 'price', sortable: false },
        { text: 'Giới hạn/Khả dụng', value: 'limit', sortable: false },
        { text: 'Thanh toán', value: 'payments', sortable: false },
      ],

      buy_data: [],
      sell_data: [],
      buy_top: [],
      sell_top: [],
      refresh: 5,
      settings: {
        buy_id: "",
        sell_id: "",
        amount_sell: 0,
        amount_buy: 0,
        sell_order: 0,
        buy_order: 0,
        buy_search: "",
        sell_search: "",
      },
      start_count: false
    }
  },
  mounted() {
    this.getSetting()
    this.getPrice()
    setInterval(() => {
      this.getPrice()
      this.start_count = true
    }, 6000);
    setInterval(() => {
      if (this.refresh == 0) {
        this.refresh = 5
        return
      }
      this.refresh = this.refresh - 1
    }, 1000);
  },
  methods: {
    getPrice() {
      this.CallAPI("get", "p2p?type=buy&page=1&asset=usdt&fiat=vnd&transAmount=" + this.settings.buy_search, {}, (res) => {
        this.buy_data = res.data.data
        let sell_info = this.buy_data.filter(i => i.adv.advNo == this.settings.sell_id)
        if (sell_info[0]) {
          this.settings.amount_sell = sell_info[0].adv.tradableQuantity;
        }

      })
      this.CallAPI("get", "p2p?type=sell&page=1&asset=usdt&fiat=vnd&transAmount=" + this.settings.sell_search, {}, (res) => {
        this.sell_data = res.data.data
        let buy_info = this.sell_data.filter(i => i.adv.advNo == this.settings.buy_id)
        if (buy_info[0]) {
          this.settings.amount_buy = buy_info[0].adv.tradableQuantity;
        }
      })
      this.CallAPI("get", "p2p?type=buy&page=1&asset=usdt&fiat=vnd", {}, (res) => {
        this.buy_top = res.data.data
      })
      this.CallAPI("get", "p2p?type=sell&page=1&asset=usdt&fiat=vnd", {}, (res) => {
        this.sell_top = res.data.data
      })
    },
    formatVNPrice(value) {
      let val = (value / 1).toFixed(0)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toFixedValue(value) {
      if (Number.isInteger(value)) {
        return value
      }
      return value.toFixed(2)
    },
    settingSave() {
      this.dialog = false
      this.settings.amount_sell = 0
      this.settings.amount_buy = 0
      this.settings.sell_order = 0
      this.settings.buy_order = 0

      let data = {
        sell_id: this.settings.sell_id,
        buy_id: this.settings.buy_id,
        buy_search: this.settings.buy_search,
        sell_search: this.settings.sell_search
      }
      localStorage.setItem("settings", JSON.stringify(data))
    },
    getSetting() {
      let data = JSON.parse(localStorage.getItem("settings"))
      this.settings.sell_id = data.sell_id
      this.settings.buy_id = data.buy_id
      this.settings.buy_search = data.buy_search
      this.settings.sell_search = data.sell_search
    },
    checkOrder() {
      this.settings.sell_order = 0
      this.settings.buy_order = 0
    },
    editAdv(id) {
      window.open("https://p2p.binance.com/vi/advEdit?code=" + id)
    }
  },
  watch: {
    "settings.amount_sell"() {
      if (!this.settings.amount_sell || !this.start_count) return
      this.settings.sell_order++
    },
    "settings.amount_buy"() {
      if (!this.settings.amount_buy || !this.start_count) return
      this.settings.buy_order++
    }
  }
};
</script>