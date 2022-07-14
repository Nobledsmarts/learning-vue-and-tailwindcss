<template>
    <div>
        <!-- Header -->
        <div class="wf-flex">
            <span class="wf-text-xl wf-font-bold wf-font-san">
                Recent activity
            </span>
            <span class="wf-ml-auto wf-mb-2">
            <router-link to="#" class="wf-mr-2 wf-text-sm wf-font-medium wf-text-gray-500">
                See all
            </router-link>
        </span>
        </div>
        <!-- Activities -->
        <div class="wf-flex wf-flex-col wf-mt-5" v-if="transactions.length">
            <div class="wf-flex wf-justify-between wf-mb-5" v-for="(transaction, key) in transactions" :key="idx">
                <div class="wf-flex">
                    <figure class="wf-p-px wf-rounded-full wf-bg-gray-100 wf-shadow wf-flex wf-justify-center wf-items-center wf-mr-3">
                        <img src="../../../../src/assets/img/fritz_1.jpg" class="wf-cover wf-w-7 wf-h-7 wf-rounded-full">
                    </figure>
                    <p class="wf-flex wf-flex-col">
                        <span class="wf-text-sm wf-font-bold wf-text-gray-900 text-capitalize">
                            {{ transaction.currency }} Deposit
                        </span>
                        <span class="wf-text-xs wf-font-medium wf-text-gray-500">
                            {{ formatTrxDate(+transaction.time) }}
                        </span>
                    </p>
                </div>
                <span class="wf-text-sm wf-font-bold wf-text-gray-900">
                    ${{ transaction.usdAmount }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount, computed } from 'vue';
    import { formatRelative, addDays } from 'date-fns';
    


    
    const transactions = ref([]);

    const transactionKeys = computed(() => {
        return Object.keys(transactions.value);
    });

    const formatTrxDate = ((date) => {
        console.log(date);
        return formatRelative(new Date(date * 1000), new Date())
    });

    onBeforeMount(async () => {
        let trx = await Moralis.Cloud.run("getTransactions");
        transactions.value = trx.slice(0, 10);

        // transactions.value = transactions.filter((transactions) => transactions.length);
        console.log(transactions);

        // balanceSideBarRight.value = balanceSideBarRight.value.map((list) => {
        //     if (list.name == 'Crypto Currency'){
        //         list.balance = balances.value.crypto;
        //         return list;
        //     }
        //     return list;
        // });
    });
</script>
