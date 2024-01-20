import { createStackNavigator } from '@react-navigation/stack';
import CategoryList from '../components/CategoryList';
import AddCategory from '../components/AddCategory';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="CategoryList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="CategoryList" component={CategoryList} />
            <Stack.Screen name="AddCategory" component={AddCategory} />
            {/* Add other screens as needed */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
