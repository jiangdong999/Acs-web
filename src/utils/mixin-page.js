// 列表页搜索表单名须为searchForm
import { mapGetters } from 'vuex';

export default {
  data(){
    return {
      loading: false,
      totalPage: 1,
      offset: 0,
      limit: 10,
      page: 1,
      totalRecord: 0,
      tableData: [],
      pageInput: 1
    }
  },
  computed: {
    ...mapGetters([
      'community'
    ])
  },
  watch: {
    'pageInput': function(newValue){
      let no = /^[1-9]\d*$/g;
      if (!no.test(newValue)) {
        this.pageInput = 1
      } else {}
    }
  },
  methods: {
    pageReset(){
      this.page = 1;
      this.offset = 0;
      this.limit = 10;
    },
    turnPage: function (page) {
      this.page = page || 1;
      this.offset = (page - 1) * this.limit;
      this.loadData(this.page-1, this.limit)
    },
    limitChange: function (limit) {
      this.limit = limit || 10;
      this.loadData(this.page-1, this.limit)
    },
    indexMethod(index) {
      return index + (this.page - 1) * 10 + 1;
    },
  }
}