import { Ionicons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import React, { useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BottomTab from "./components/BottomTab";

export default function TodoListScreen() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Complete CS2100 Assignment', module: 'CS2100', completed: false },
    { id: '2', text: 'Read ES2660 Chapter 4', module: 'ES2660', completed: true },
    { id: '3', text: 'Prepare for CS2107 Quiz', module: 'CS2107', completed: false },
  ]);
  
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now().toString(), 
        text: newTodo, 
        module: 'General',
        completed: false 
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>To-Do List</Text>
            <TouchableOpacity style={styles.bellIcon}>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Add New Todo */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a new task..."
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={addTodo}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Todo List */}
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.todoItem}>
                <Checkbox
                  value={item.completed}
                  onValueChange={() => toggleTodo(item.id)}
                  color={item.completed ? '#003049' : undefined}
                  style={styles.checkbox}
                />
                <View style={styles.todoTextContainer}>
                  <Text 
                    style={[
                      styles.todoText, 
                      item.completed && styles.completedText
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text style={styles.moduleText}>{item.module}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {todos.filter(t => !t.completed).length} remaining
            </Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Clear completed</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Consistent Bottom Navigation */}
        <View style={styles.bottomNav}>
          <BottomTab icon="home" label="Home"  />
          <BottomTab icon="calendar" label="Timetable"  />
          <BottomTab icon="list" label="To-Do" />
          <BottomTab icon="user" label="Profile"  />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003049",
  },
  bellIcon: {
    backgroundColor: "#003049",
    padding: 10,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#003049",
    borderRadius: 10,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 15,
    width: 22,
    height: 22,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  moduleText: {
    fontSize: 12,
    color: "#003049",
    marginTop: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statsText: {
    color: "#003049",
    fontWeight: "bold",
  },
  clearText: {
    color: "#ff6b6b",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#003049",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});