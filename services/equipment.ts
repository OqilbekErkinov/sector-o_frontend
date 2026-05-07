import { $api } from '@/http/interceptor';

const getEquipment = () => {
  return $api.get('/equipments');
};

export default {
    getEquipment
};





// import { ref } from 'vue';
// import { useEquipmentStore } from '@/store/equipment';
// const EquipmentStore = useEquipmentStore();
// const equipments = ref(null)
