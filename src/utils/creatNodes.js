let id = 0;

export default {
  data() {
    return {
    }
  },
  methods: {
    createNode(nodeParams) {
      this.tree = []
      // level:1为小区，2为区域，3为楼栋，4为单元，5为楼层，6为房间
      let communityNode = { id: id++, label: nodeParams.communityName || '当前小区', type: "N", level: 1, children: [] }

      return this.createArea(nodeParams, communityNode)
    },
    createArea(nodeParams, parentNode) {
      let areaCount = parseInt(nodeParams.areaCount)

      if (areaCount === 0) {
        // 若小区不设置区域
        return this.createBuild(nodeParams, parentNode)
      } else {

        for (var i = 0; i < areaCount; i++) {
          let areaNode = { type: "N", level: 2, children: [] }
          areaNode.id = id++
          areaNode.label = String.fromCharCode(i + 65) + '区'
          
          parentNode.children.push(this.createBuild(nodeParams, areaNode))
        }

        return parentNode
      }
    },
    createBuild(nodeParams, parentNode) {
      let buildCount = parseInt(nodeParams.buildCount)

      if (buildCount === 0) {
        this.$message.error('楼栋数量错误')
      } else {

        for (var i = 0; i < buildCount; i++) {
          let buildNode = { type: "N", level: 3, children: [] }
          buildNode.id = id++
          buildNode.label = (i + 1) + '栋'
          
          parentNode.children.push(this.createPart(nodeParams, buildNode))
        }

        return parentNode
      }
    },
    createPart(nodeParams, parentNode) {
      let partCount = parseInt(nodeParams.partCount)

      if (partCount === 0) {
        return this.createFloor(nodeParams, parentNode)
      } else {

        for (var i = 0; i < partCount; i++) {
          let partNode = { type: "N", level: 4, children: [] }
          partNode.id = id++
          partNode.label = (i + 1) + '单元'

          parentNode.children.push(this.createFloor(nodeParams, partNode))
        }

        return parentNode
      }
    },
    createFloor(nodeParams, parentNode) {
      let floorCount = parseInt(nodeParams.floorCount)

      if (floorCount === 0) {
        this.$message.error('楼层数量错误')
      } else {

        for (var i = 0; i < floorCount; i++) {
          let floorNode = { type: "N", level: 5, children: [] }
          floorNode.id = id++
          floorNode.label = (i + 1) + '层'

          parentNode.children.push(this.createRoom(nodeParams, floorNode, i + 1))
        }

        return parentNode
      }
    },
    createRoom(nodeParams, parentNode, floor) {
      let roomCount = parseInt(nodeParams.roomCount)
      let floorStr = floor > 9 ? floor + '' : '0' + floor

      for (var i = 0; i < roomCount; i++) {
        let roomNode = { type: "R", level: 6 }
        roomNode.id = id++

        let roomStr = (i + 1) > 9 ? (i + 1) + '' : '0' + (i + 1)
        roomNode.label = floorStr + roomStr

        parentNode.children.push(roomNode)
      }

      return parentNode
    },
  }
}