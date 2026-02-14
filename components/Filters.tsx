'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from './DateRangePicker';

interface FiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    categories: string[];
}

export function Filters({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateRange,
    setDateRange,
    categories,
}: FiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm mb-6 border">
            <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row">
                {/* Search */}
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* Category */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[200px] cursor-pointer">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category} className="capitalize cursor-pointer">
                                {category.replace('-', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Range */}
                <DateRangePicker
                    date={dateRange}
                    setDate={setDateRange}
                    className="w-full md:w-auto"
                />
            </div>

            {/* Reset Filters */}
            {(searchQuery || selectedCategory !== 'all' || dateRange) && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setDateRange(undefined);
                    }}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reset Filters
                </Button>
            )}
        </div>
    );
}
