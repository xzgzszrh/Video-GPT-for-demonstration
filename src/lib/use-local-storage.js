"use client";

import { useState, useEffect } from 'react';

/**
 * 自定义 Hook 用于在 localStorage 中存储和检索值
 * @param {string} key - localStorage 中使用的键
 * @param {any} initialValue - 如果 localStorage 中没有值，则使用的初始值
 * @returns {[any, Function]} - 返回当前值和更新值的函数
 */
export function useLocalStorage(key, initialValue) {
  // 创建一个状态，用于存储/更新值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 如果在服务器端渲染，返回初始值
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // 从 localStorage 获取值
      const item = window.localStorage.getItem(key);
      // 如果值存在，解析并返回；否则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 如果出错，返回初始值
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 定义一个函数来更新 localStorage 和状态
  const setValue = (value) => {
    try {
      // 允许值是一个函数，就像 useState 的 setter 一样
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 保存到状态
      setStoredValue(valueToStore);
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 当 key 改变时，重新获取值
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}
