<template>
    <ViewWrapper>
        <div class="wf-block">
            <div class="wf-flex wf-flex-col wf-items-center">
                <h4 class="wf-text-gray-700 wf-text-base wf-text-medium wf-capitalize wf-font-medium wf-mb-5">
                    Current wallet balance
                </h4>
                <h5 class="wf-text-gray-500 wf-text-5xl wf-font-bold wf-mb-5">
                    $3,293.46
                </h5>

                <div class="wf-mb-5">
                    <div
                        class="wf-flex  wf-bg-gray-200 wf-text-700 wf-rounded-full wf-items-center wf-w-full wf-px-2 wf-py-1">
                        <span
                            class="wf-w-7 wf-h-7 wf-bg-gray-700 wf-rounded-full wf-flex wf-justify-center wf-items-center">
                            <span
                                class="wf-w-5 wf-h-5 wf-rounded-full wf-ring-1 wf-ring-yellow-700 wf-flex wf-justify-center wf-items-center">
                                <span class="wf-w-4 wf-h-4 wf-rounded-full wf-bg-yellow-500"></span>
                            </span>
                        </span>
                        <span class="wf-text-sm wf-font-bold wf-ml-3 wf-capitalize wf-mr-2">
                            smart chain bep-20
                        </span>
                        <ChevronDownIcon class="wf-w-5 wf-h-5 wf-opacity-70" />
                    </div>
                </div>
            </div>
            <div class="wf-flex wf-flex-col">
                <div class="wf-flex wf-mb-5">
                    <span class="wf-text-xl wf-text-gray-900 wf-capitalize wf-font-bold">
                        spacearn
                        <span class="wf-text-gray-700 wf-text-base wf-capitalize wf-font-medium wf-ml-2">
                            Buy
                        </span>
                    </span>
                    <DotsHorizontalIcon class="wf-ml-auto wf-w-6 wf-h-6 wf-text-gray-900" />
                </div>
                <div class="wf-flex wf-flex-col wf-bg-gray-200 wf-text-gray-800 wf-rounded-3xl wf-py-5 md:wf-mb-20">
                    <div class="wf-px-3 wf-flex wf-flex-col">
                        <div class="wf-flex wf-flex-col wf-mb-3">
                            <span class="wf-text-base wf-font-bold wf-ml-3 wf-mb-2">
                                YOU PAY
                            </span>
                            <div
                                class="wf-w-full wf-bg-gray-800 wf-py-2 wf-rounded-full wf-px-2 wf-flex wf-items-center">
                                <!-- <span
                                    class="wf-flex wf-items-center wf-uppercase wf-text-xs wf-font-bold wf-rounded-full wf-bg-gray-600 wf-shadow wf-shadow-gray-800 wf-py-2 wf-px-2.5 wf-text-gray-100">
                                     img 
                                    <figure class="wf-rounded-full wf-w-5 wf-h-5 wf-bg-yellow-500 wf-mr-2"></figure>
                                    $usd
                                    <ChevronRightIcon class="wf-w-4 wf-h-4 wf-ml-1" />
                                </span> -->
                                <label
                                    class="wf-bg-red- wf-relative before:wf-top-[calc(50%-10px)] before:wf-bg-yellow-500 before:wf-h-5 before:wf-w-5 before:wf-content-[''] before:wf-rounded-full before:wf-absolute wf-flex wf-items-center wf-outline-0 wf-uppercase wf-text-xs wf-font-bold wf-rounded-full wf-bg-gray-600 wf-shadow wf-shadow-gray-800 wf-text-gray-100 wf-pl-2">
                                    <!-- img -->
                                    <!-- <figure class="wf-rounded-full wf-w-5 wf-h-5 wf-bg-green-500 wf-mr-2"></figure>
                                    usdt
                                    <ChevronRightIcon class="wf-w-4 wf-h-4 wf-ml-1" /> -->
                                    <select
                                        class="wf-flex wf-items-center wf-outline-0 wf-uppercase wf-text-xs wf-font-bold wf-rounded-full wf-bg-gray-600 wf-shado wf-shadow-gray-800 wf-py-2 wf-px-2.5 wf-text-gray-100 wf-ml-3"
                                        @change="changeCoin" v-model="currency">
                                        <option value="usd">USD</option>
                                        <option value="eur">EUR</option>
                                        <option value="gbp">GBP</option>
                                        <option value="gbp">KWD</option>
                                        <option value="cad">CAD</option>
                                    </select>
                                </label>
                                <hr class="wf-h-4 wf-border-[.5px] wf-border-gray-400 wf-ml-1">
                                <div class="wf-w-full wf-ml-2 wf-mr-3">
                                    <input v-model="currency_value" v-debounce:300="setRate"
                                        @keypress.prevent="validateNumber" type="text"
                                        class="wf-outline-none wf-w-full wf-bg-transparent wf-border-0 wf-text-gray-300 wf-font-normal placeholder:wf-text-gray-500"
                                        placeholder="0.0002 - 100" data-model="currency_value"
                                        @focus="setActiveKeyboard" @blur="clearActiveKeyboard" autofocus>
                                </div>
                                <span
                                    class="wf-ml-auto wf-uppercase wf-text-yellow-600 wf-text-sm wf-font-medium wf-mr-1">max</span>
                            </div>
                            <!-- balance -->
                            <!-- <span class="wf-text-xs wf-font-medium wf-ml-4 wf-text-gray-700">Available: 430.00</span> -->
                        </div>

                        <div class="wf-flex wf-flex-col wf-mb-3">
                            <span class="wf-text-base wf-font-bold wf-ml-3 wf-mb-2">
                                YOU GET
                            </span>
                            <div
                                class="wf-w-full wf-bg-gray-800 wf-py-2 wf-rounded-full wf-px-2 wf-flex wf-items-center">
                                <label
                                    class="wf-bg-red- wf-relative before:wf-top-[calc(50%-10px)] before:wf-bg-green-500 before:wf-h-5 before:wf-w-5 before:wf-content-[''] before:wf-rounded-full before:wf-absolute wf-flex wf-items-center wf-outline-0 wf-uppercase wf-text-xs wf-font-bold wf-rounded-full wf-bg-gray-600 wf-shadow wf-shadow-gray-800 wf-text-gray-100 wf-pl-2">
                                    <!-- img -->
                                    <!-- <figure class="wf-rounded-full wf-w-5 wf-h-5 wf-bg-green-500 wf-mr-2"></figure>
                                    usdt
                                    <ChevronRightIcon class="wf-w-4 wf-h-4 wf-ml-1" /> -->
                                    <select
                                        class="wf-flex wf-items-center wf-outline-0 wf-uppercase wf-text-xs wf-font-bold wf-rounded-full wf-bg-gray-600 wf-shado wf-shadow-gray-800 wf-py-2 wf-px-2.5 wf-text-gray-100 wf-ml-3"
                                        @change="changeCoin" v-model="coin">
                                        <option value="btc">BTC</option>
                                        <option value="eth">ETH</option>
                                        <option value="doge">DOGE</option>
                                    </select>
                                </label>
                                <hr class="wf-h-4 wf-border-[.5px] wf-border-gray-400 wf-ml-1">
                                <div class="wf-w-full wf-ml-2 wf-mr-3">
                                    <input type="text"
                                        class="wf-outline-none wf-w-full wf-bg-transparent wf-border-0 wf-text-gray-300 wf-font-normal placeholder:wf-text-gray-500"
                                        v-model="coin_value" placeholder="0.0002 - 100"
                                        v-debounce:300="getCurrencyValue" @focus="setActiveKeyboard"
                                        data-model="coin_value" @keypress.prevent="validateNumber"
                                        @blur="clearActiveKeyboard">
                                </div>
                            </div>
                            <!-- balance -->
                            <!-- <span class="wf-text-xs wf-font-medium wf-ml-4 wf-text-gray-700">Available: 430.00</span> -->
                        </div>
                    </div>
                    <hr class="wf-w-full wf-border-[0.5px] wf-border-gray-100 wf-mb-5">
                    <div class="wf-flex wf-mx-3 wf-mb-5">
                        <button
                            class="wf-w-full wf-bg-yellow-700 wf-capitalize wf-rounded-full wf-py-3 wf-text-yellow-50 wf-font-medium wf-flex wf-justify-center wf-items-center">
                            <SwitchVerticalIcon class="wf-w-5 wf-h-5 wf-mr-2" />
                            Buy
                        </button>
                    </div>

                    <div class="wf-flex wf-mx-3">
                        <span class="wf-text-gray-700 wf-font-bold wf-text-sm wf-pl-3">
                            Total :
                        </span>
                        <span class="wf-ml-auto wf-text-gray-700 wf-font-bold wf-text-sm wf-pr-3">
                            $581.79
                        </span>
                    </div>
                </div>
                <div class="wf-mx-1 wf-mt-5 md:wf-hidden">
                    <MobileKeyPad :buttons="keypadButtons" v-model="changeActiveKey" :inputs="inputs"
                        :focusCount="focusCount" />
                </div>
            </div>
        </div>
    </ViewWrapper>
</template>

<script setup lang="ts">
import ViewWrapper from '../partials/ViewWrapper.vue';
import MobileKeyPad from '../../../common/components/Cards/MobileKeyPad.vue';
import { onBeforeMount, onMounted, ref, watch, reactive, customRef, computed } from 'vue';
import topbar from '../../../plugins/topbar';
import { ChevronDownIcon, ChevronRightIcon, BackspaceIcon } from '@heroicons/vue/solid';
import { SwitchVerticalIcon, DotsHorizontalIcon } from '@heroicons/vue/outline';

onBeforeMount(() => topbar.show())
onMounted(() => topbar.hide())

let keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let mappedDigit = [];
for (let i = 0; i < keypadNumbers.length; i++) {
    mappedDigit.push({ digit: keypadNumbers[i] })
}

let actionLine = [
    {
        digit: '.'
    },
    {
        digit: 0
    },
    {
        digit: 'c',
        action: 'del',
        icon: BackspaceIcon
    }
];
const keypadButtons = [
    ...mappedDigit,
    ...actionLine
];

const coin = ref('btc');
const coin_value = ref('');
const currency = ref('usd');
const currency_value = ref('');
const focusCount = ref(1);

function useActiveKeyRef(value) {
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value
            },
            set(newValue){
                value = newValue;
                console.log(newValue);
                trigger();
            }
        }
    });
}
const inputs = useActiveKeyRef({
    currentlyFocused: 'currency_value',
    currency_value : currency_value,
    coin_value : coin_value,
});
const changeActiveKey = computed({
    get : () => {
        if (inputs.value.currentlyFocused == 'currency_value') {
            return (currency_value.value);
        } else if (inputs.value.currentlyFocused == 'coin_value') {
            return (coin_value.value);
        }
        // return input.value.key;
    },
    set : (value) => {
        if(inputs.value.currentlyFocused == 'currency_value'){
            currency_value.value = value;
        } else if (inputs.value.currentlyFocused == 'coin_value'){
            coin_value.value = value;
            console.log(coin_value.value);

        }
    }
})
const currentlyFocused = computed({
    get() {
        return inputs.value.currentlyFocused;
    },
    set(value) {
        inputs.value.currentlyFocused = value;
        if (inputs.value.currentlyFocused == 'currency_value') {
            currency_value.value = currency_value.value;
            // console.log(currency_value.value);
        } else if (inputs.value.currentlyFocused == 'coin_value') {
            coin_value.value = coin_value.value;

        }
    }
})

function setActiveKeyboard(e){
    let input = e.currentTarget;
    if(input.dataset.model == 'currency_value'){
        currentlyFocused.value = 'currency_value';
    } else if (input.dataset.model == 'coin_value') {
        currentlyFocused.value = 'coin_value';
    }
    focusCount.value++;
}

function validateNumber(e) {
    let { currentlyFocused } = inputs.value;
    let input = inputs.value[currentlyFocused];
    let ASCIICode = (e.which) ? e.which : e.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && (ASCIICode != 46)) {
        console.log(ASCIICode)
        return false;
    }
    if (input.value.indexOf('.') != -1 && ASCIICode == 46) return
    if (!input.value.length && ASCIICode == 46) {
        input.value += '0.';
        return;
    }
    input.value += e.key;
    return true;
}



async function fetchRate() {
    let response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${currency.value}&tsyms=${coin.value}`);
    let response_value = await response.json();
    return response_value[coin.value.toUpperCase()];
}
async function setRate(){
    let rate = await fetchRate();
    coin_value.value = rate * (+currency_value.value);
}
function changeCoin(){
    // alert(currency.value)
    setRate();
}
async function getCurrencyValue() {
    let rate = await fetchRate();
    console.log(rate);
    currency_value.value = coin_value.value / rate;
}
</script>