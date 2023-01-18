<template>
    <div>
        <div class="input-number-range" :class="{ 'is-disabled': disabled }">
            <div class="flex">
                <div class="from">
                    <el-input ref="input_from" v-model="userInputForm" :disabled="disabled"
                        :placeholder="minPlaceholder" @blur="handleBlurFrom" @focus="handleFocusFrom"
                        @input="handleInputFrom" @change="handleInputChangeFrom"></el-input>
                </div>
                <div class="center">
                    <span>至</span>
                </div>
                <div class="to">
                    <el-input ref="input_to" v-model="userInputTo" :disabled="disabled" :placeholder="maxPlaceholder"
                        @blur="handleBlurTo" @focus="handleFocusTo" @input="handleInputTo"
                        @change="handleInputChangeTo"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputNumberRange',

    props: {
        modelValue: { required: true },

        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        },


        minPlaceholder: {
            type: String,
            default: '最小值'
        },

        maxPlaceholder: {
            type: String,
            default: '最大值'
        },

        // 精度参数
        precision: {
            type: Number,
            default: 0,
            validator(val) {
                return val >= 0 && val === parseInt(val, 10);
            }
        }
    },

    data() {
        return {
            userInputForm: null,
            userInputTo: null
        };
    },

    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                if (value === undefined) {
                    this.userInputForm = undefined;
                    this.userInputTo = undefined;
                }
                if (value instanceof Array && this.precision !== undefined) {
                    this.userInputForm = typeof value[0] === 'number' ? value[0] : '';
                    this.userInputTo = typeof value[1] === 'number' ? value[1] : '';
                }
            }
        }
    },

    methods: {
        // 根据精度保留数字
        toPrecision(num, precision) {
            if (precision === undefined) precision = 0;
            return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
        },

        handleBlurFrom(event) {
            this.$emit('blurfrom', event);
        },

        handleFocusFrom(event) {
            this.$emit('focusfrom', event);
        },

        handleBlurTo(event) {
            this.$emit('blurto', event);
        },

        handleFocusTo(event) {
            this.$emit('focusto', event);
        },

        handleInputFrom(value) {
            this.$emit('inputfrom', value);
            // this.userInputFrom = value
        },

        handleInputTo(value) {
            this.$emit('inputto', value);
            // this.userInputTo = value
        },

        // from输入框change事件
        handleInputChangeFrom(value) {
            // 如果是非数字空返回null
            if (isNaN(value) || value === '') {
                this.userInputForm = '';
                this.$emit('update:modelValue', ['', this.userInputTo].join(','));
                this.$emit('changefrom', this.userInputForm);
                return;
            }

            // 初始化数字精度
            this.userInputForm = this.setPrecisionValue(value);

            // 如果from > to 将from值替换成to
            if (typeof this.userInputTo === 'number') {
                this.userInputForm =
                    parseFloat(this.userInputForm) <= parseFloat(this.userInputTo)
                        ? this.userInputForm
                        : this.userInputTo;
            }
            this.$emit('update:modelValue', [this.userInputForm, this.userInputTo].join(','));
            this.$emit('changefrom', this.userInputForm);
        },

        // to输入框change事件
        handleInputChangeTo(value) {
            // 如果是非数字空返回null
            if (isNaN(value) || value === '') {
                this.userInputTo = '';
                this.$emit('update:modelValue', [this.userInputForm, ''].join(','));
                this.$emit('changefrom', this.userInputTo);
                return;
            }

            // 初始化数字精度
            this.userInputTo = this.setPrecisionValue(value);

            if (typeof this.userInputForm === 'number') {
                this.userInputTo =
                    parseFloat(this.userInputTo) >= parseFloat(this.userInputForm)
                        ? this.userInputTo
                        : this.userInputForm;
            }
            this.$emit('update:modelValue', [this.userInputForm, this.userInputTo].join(','));
            this.$emit('changeto', this.userInputTo);
        },

        // 设置成精度数字
        setPrecisionValue(value) {
            if (this.precision !== undefined) {
                const val = this.toPrecision(value, this.precision);
                return val;
            }
            return null;
        }
    }
};
</script>
<style lang="scss" scoped>
// 取消element原有的input框样式
:deep(.el-input--mini .el-input__inner) {
    border: 0px;
    margin: 0;
    padding: 0 15px;
    background-color: transparent;
}

.input-number-range {
    background-color: #fff;
    border-radius: 4px;
}

.flex {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;

    .center {
        margin: 0px 6px;
    }
}

.is-disabled {
    background-color: #eef0f6;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
}
</style>