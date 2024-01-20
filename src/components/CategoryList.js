import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimationFlatlist from 'react-native-animated-image-list';
import CategoryModel from '../models/CategoryModel';

const { width, height } = Dimensions.get('window');

const SampleData = [
    new CategoryModel("1", "House", "https://imgs.search.brave.com/NhxG3cdCLJCZWSb7p4WZ6Aq0Me_bYdd3nD5pPH2yT1o/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/MjEyODUzMC9waG90/by9ob21lLXdpdGgt/Ymx1ZS1zaWRpbmct/YW5kLXN0b25lLWZh/JUMzJUE3YWRlLW9u/LWJhc2Utb2YtaG9t/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9Mm52LTkzY3Fh/a0dDdlZRMUNNYXZ4/X28xNEhTQnJ1Q0R3/S2R2M0xsaDVFaz0"),
    new CategoryModel("2", "School", "https://imgs.search.brave.com/YxIo2sQ08QmcDPWZxshfg1UMK6kaohi0KrDQ0srjjAw/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzI0LzYyLzM3/LzM2MF9GXzI0NjIz/NzU5X3p0eGt6R2g1/MmFhYWRiU3BpSXFE/dWpsT0hsRWRBWEsw/LmpwZw"),
    new CategoryModel("3", "City", "https://imgs.search.brave.com/YRFlvwc72qbLGsuR-Jmd3otiJozhAq4LpBFbpOHoOjk/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/ZG93bnRvd24tY2l0/eS1za3lsaW5lLmpw/Zz93aWR0aD0xMDAw/JmZvcm1hdD1wanBn/JmV4aWY9MCZpcHRj/PTA"),
    new CategoryModel("4", "Sport", "https://imgs.search.brave.com/Z04N-Dbzwybz6jLr_vs3XOvGgcg37OhkQXUVy_B4BNU/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzA0LzQzLzc5/LzM2MF9GXzQ0Mzc5/NzRfRGJFNE5SaWFv/UnRVZWl2TXlmUG9Y/WkZOZENuWW1qUHEu/anBn"),
];

const ITEM_SIZE = width - 120;
const ITEM_HEIGHT = height / 2;


const CategoryList = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState(SampleData);

    const handleAddCategory = () => {
        // Navigate to the AddCategory component
        navigation.navigate('AddCategory', {
            onCategoryAdd: handleCategoryAdd,
        });
    };

    const handleCategoryAdd = useCallback((newCategory) => {
        // Update state with the new category
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleAddCategory}>
                <Text>ADD CATEGORY</Text>
            </TouchableOpacity>
            <AnimationFlatlist
                data={categories.map((category) => ({
                    key: category.CategoryID,
                    title: category.name,
                    image: category.imageURL,
                }))}
                height={ITEM_HEIGHT}
                width={ITEM_SIZE}
                title={'Welcome'}
                subTitle={'Discover Category'}
                primaryBackgroundColor='#28AC'
                secondaryBackgroundColor='#d3d3d3'
                textPrimaryColor='#fff'
                textSecondaryColor='#000'
            />
        </View>
    );
};

export default CategoryList;