<template>
  <div class="station-chart">
      <div></div>
  </div>
</template>

<script>
export default {
    name:'stationChart',
    data(){
        return {
            detail:{
                "code": 0,
                "msg": "suc",
                "data": {
                    "package": [
                    {
                        "date": "2018-04-17",
                        "package_statistic": {
                        "collected": 3000,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-18",
                        "package_statistic": {
                        "collected": 3000,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-19",
                        "package_statistic": {
                        "collected": 3000,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-20",
                        "package_statistic": {
                        "collected": 3000,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-21",
                        "package_statistic": {
                        "collected": 3000,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-22",
                        "package_statistic": {
                        "collected": 3300,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    },
                    {
                        "date": "2018-04-23",
                        "package_statistic": {
                        "collected": 3100,
                        "stored": 2800,
                        "deliverd": 2500,
                        "delayed": 500,
                        "transferd": 100,
                        "auto_deliverd": 2000
                        }
                    }
                    ],
                    "members": [
                    {
                        "id": 1,
                        "role_id": 1,
                        "role_name": "超级管理员",
                        "name": "张三",
                        "phone": "18945612547",
                        "created_at": 1522288785339
                    },
                    {
                        "id": 2,
                        "role_id": 2,
                        "role_name": "管理员",
                        "name": "李四",
                        "phone": "18945612547",
                        "created_at": 1522288785339
                    },
                    {
                        "id": 3,
                        "role_id": 3,
                        "role_name": "员工",
                        "name": "员工1",
                        "phone": "18945612547",
                        "created_at": 1522288785339
                    },
                    {
                        "id": 4,
                        "role_id": 3,
                        "role_name": "员工",
                        "name": "员工1",
                        "phone": "18945612547",
                        "created_at": 1522288785339
                    },
                    {
                        "id": 5,
                        "role_id": 3,
                        "role_name": "员工",
                        "name": "员工1",
                        "phone": "18945612547",
                        "created_at": 1522288785339
                    }
                    ]
                }
            }
        }
    }
}
</script>

<style>

</style>
