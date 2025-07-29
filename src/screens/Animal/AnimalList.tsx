import React, { useContext, useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@apollo/client';
import {
  GET_COMPANY_HAS_USER_WISE_ANIMALS,
  GET_ANIMAL_BREED_TYPES,
} from '../../graphql/queries/Animal/animal.query';
import { deleteObject } from '../../graphql/mutation.service';
import { assignLabels, getTableHeader } from '../../library/utilities/helperFunction';
import { Ionicons } from '@expo/vector-icons';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { MessageContext } from '../../contexts/MessageContext';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import AnimalCreate from './AnimalCreate';
import AnimalUpdate from './AnimalUpdate';
import Loader from '../../components/Loader';
import EmptyComponent from '../../components/EmptyComponent';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';

export default function AnimalList() {
  const { user } = useContext(AuthenticatedUserContext);
  const { t } = useCapitalizedTranslation();
  const { data, refetch } = useQuery(GET_COMPANY_HAS_USER_WISE_ANIMALS, {
    variables: { companyHasUserId: user?.companyHasUserId },
    fetchPolicy: 'network-only',
  });
  const { data: animalBreedTypeData } = useQuery(GET_ANIMAL_BREED_TYPES);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pushMessageFromMutationResponse } = useContext(MessageContext);

  const animalBreedTypes = useMemo(
    () => animalBreedTypeData?.getAnimalBreedTypes?.options ?? [],
    [animalBreedTypeData]
  );

  const animals = useMemo(() => {
    const companyHasUsers = data?.getCurrentUser?.company_has_users ?? [];

    const flattenedAnimals = companyHasUsers.flatMap((companyHasUser) =>
      (companyHasUser?.company_has_user_has_animals ?? []).map((animal) => {
        const animalData = animal.animal;
        return {
          id: animalData.id,
          name: animalData.name,
          type: animalData.type,
          breed_type: animalData.breed_type,
          company_name: companyHasUser?.company?.name,
          file_id: animalData.file_id,
          breed_type_name: assignLabels(animalData.breed_type, animalBreedTypes),
          company_has_user_has_animal_id: animal.id,
        };
      })
    );

    setLoading(false);

    return flattenedAnimals;
  }, [data, animalBreedTypes]);

  const handleDelete = async () => {
    if (!idToDelete) return;
    const res = await deleteObject(idToDelete, 'CompanyHasUserHasAnimal');
    pushMessageFromMutationResponse(res.response);
    if (res.success) refetch();
    setIdToDelete(null);
  };

  if (loading || !data) {
    return <Loader loading={true} />;
  }

  return (
    <Loader loading={loading}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{getTableHeader('objects.animal.headingLabels.plural', t)}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#1e90ff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={animals}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.animalName} numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Text>
                <Text style={styles.parkName}>
                  {t('objects.company.headingLabels.singular')} : {item.company_name}
                </Text>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>{item.breed_type_name}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setSelectedAnimal(item);
                  setUpdateModalVisible(true);
                }}
              >
                <Ionicons name="pencil" size={18} color="#007aff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIdToDelete(item.company_has_user_has_animal_id)}
              >
                <Ionicons name="trash" size={18} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={EmptyComponent('No animals found')}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <AnimalCreate
              setAnimalDialog={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={updateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <AnimalUpdate
              data={selectedAnimal!}
              setAnimalDialog={() => setUpdateModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <ConfirmDeleteModal
        visible={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={handleDelete}
        entityName={'Animal'}
      />
    </Loader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1eaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#007aff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  animalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  typeTag: {
    backgroundColor: '#e0f7e9',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  parkName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
});
