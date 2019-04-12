import React, {Component} from 'react';
import {StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, Platform, Alert,AsyncStorage} from 'react-native';
import moment from 'moment/moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.jpg'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import AddTask from './AddTask'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
export default class Agenda extends Component {

    state = {
        tasks: [],
        visibleTasks: [],
        showDoneTasks: true,
        showAddTask: false,
    }

    addTask = task =>{
        const tasks = [...this.state.tasks];
        console.log('veio aki ? 33')
        tasks.push({
            id: Math.random(),
            description: task.desc,
            estimateAt: task.date,
            doneAt: null
        })
        this.setState({tasks, showAddTask: false}, this.filterTaks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({tasks}, this.filterTaks)
    }

    filterTaks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({visibleTasks});
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));

    }

    toggleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTaks)
    };

    componentDidMount = async () => {
        const data = await AsyncStorage.getItem('tasks');
        const tasks = JSON.parse(data) || [];
        this.setState({tasks}, this.filterTaks)
      //  this.filterTaks();
        console.log('init aki')
    }

    toogleTask = id => {
        const tasks = this.state.tasks.map(task => {
            if (task.id === id) {
                task = {...task}
                task.doneAt = task.doneAt ? null : new Date()
            }
            return task
        })

        this.setState({tasks}, this.filterTaks )
    }

    render() {
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} onSave={this.addTask} onCancel={() => this.setState({showAddTask: false})} />
                <ImageBackground source={todayImage}
                                 style={styles.background}>

                    <View>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                  size={35} color={commonStyles.colors.secondary} style={styles.iconBar}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={{padding: 15, backgroundColor: '#f1f1f1'}}></View>
                <View style={styles.tasksContainer}>
                    <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`} renderItem={({item}) =>
                        <Task  {...item} toogleTask={this.toogleTask} onDelete={this.deleteTask} /> }
                    />
                </View>

                <ActionButton
                    buttonColor={commonStyles.colors.today}
                    onPress={()=> {this.setState({showAddTask: true})}}
                > </ActionButton>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 25
    },
    tasksContainer: {
        padding: 15,
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',

    }
});

