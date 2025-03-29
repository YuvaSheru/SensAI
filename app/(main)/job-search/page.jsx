'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Building2, Calendar, Briefcase, DollarSign, Filter, ChevronLeft, ChevronRight, X, History, Share2, Zap, BarChart2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Label
} from "@/components/ui/label";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Adzuna categories
const jobCategories = [
  "IT Jobs",
  "Engineering Jobs",
  "Healthcare & Nursing Jobs",
  "Sales Jobs",
  "Accounting & Finance Jobs",
  "Teaching Jobs",
  "Admin Jobs",
  "Marketing Jobs",
  "Scientific & QA Jobs",
  "Other"
];

const contractTypes = [
  "full_time",
  "part_time",
  "permanent",
  "contract",
  "temporary",
  "internship"
];

const experienceLevels = [
  { label: 'Entry Level', value: 'entry' },
  { label: 'Mid Level', value: 'mid' },
  { label: 'Senior Level', value: 'senior' },
  { label: 'Lead', value: 'lead' },
  { label: 'Manager', value: 'manager' },
  { label: 'Director', value: 'director' },
  { label: 'Executive', value: 'executive' }
];

const workTypes = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
  { label: 'Flexible', value: 'flexible' }
];

const sortOptions = [
  { label: 'Most Recent', value: 'date' },
  { label: 'Salary', value: 'salary' },
  { label: 'Relevance', value: 'relevance' }
];

// Add filter presets
const filterPresets = [
  {
    name: 'Remote Tech Jobs',
    description: 'High-paying remote positions in tech',
    filters: {
      category: 'IT Jobs',
      work_type: 'remote',
      salary_min: 80000,
      experience_level: 'mid'
    }
  },
  {
    name: 'Entry Level Marketing',
    description: 'Marketing positions for recent graduates',
    filters: {
      category: 'Marketing Jobs',
      experience_level: 'entry',
      max_days_old: 7
    }
  },
  {
    name: 'Senior Engineering',
    description: 'Senior engineering roles with competitive salaries',
    filters: {
      category: 'Engineering Jobs',
      experience_level: 'senior',
      salary_min: 120000,
      contract_type: 'full_time'
    }
  },
  {
    name: 'Healthcare Remote',
    description: 'Remote healthcare and nursing positions',
    filters: {
      category: 'Healthcare & Nursing Jobs',
      work_type: 'remote',
      contract_type: 'full_time'
    }
  }
];

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [lastSearchCriteria, setLastSearchCriteria] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    contract_type: '',
    salary_min: 0,
    salary_max: 500000,
    company: '',
    max_days_old: 30,
    sort_by: 'date',
    experience_level: '',
    work_type: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 0,
    results_per_page: 20
  });
  const [filterAnalytics, setFilterAnalytics] = useState({
    categories: {},
    experienceLevels: {},
    workTypes: {},
    contractTypes: {}
  });
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [customPresets, setCustomPresets] = useState([]);

  // Load saved searches on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobSearches') || '[]');
    setSavedSearches(saved);
  }, []);

  // Load custom presets on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customJobSearchPresets') || '[]');
    setCustomPresets(saved);
  }, []);

  // Generate shareable URL
  const generateShareableUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (location) params.append('loc', location);
    if (filters.category) params.append('cat', filters.category);
    if (filters.contract_type) params.append('type', filters.contract_type);
    if (filters.salary_min > 0) params.append('min', filters.salary_min);
    if (filters.salary_max < 500000) params.append('max', filters.salary_max);
    if (filters.company) params.append('comp', filters.company);
    if (filters.max_days_old !== 30) params.append('days', filters.max_days_old);
    if (filters.sort_by !== 'date') params.append('sort', filters.sort_by);
    
    return `${window.location.origin}/job-search?${params.toString()}`;
  };

  // Share URL
  const shareSearchUrl = async () => {
    const url = generateShareableUrl();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Job Search Results',
          text: 'Check out these job opportunities!',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Search URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Load search from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParams = {
      query: params.get('q') || '',
      location: params.get('loc') || '',
      category: params.get('cat') || '',
      contract_type: params.get('type') || '',
      salary_min: parseInt(params.get('min')) || 0,
      salary_max: parseInt(params.get('max')) || 500000,
      company: params.get('comp') || '',
      max_days_old: parseInt(params.get('days')) || 30,
      sort_by: params.get('sort') || 'date'
    };

    if (Object.values(searchParams).some(value => value !== '' && value !== 0 && value !== 500000 && value !== 30 && value !== 'date')) {
      setSearchTerm(searchParams.query);
      setLocation(searchParams.location);
      setFilters({
        category: searchParams.category,
        contract_type: searchParams.contract_type,
        salary_min: searchParams.salary_min,
        salary_max: searchParams.salary_max,
        company: searchParams.company,
        max_days_old: searchParams.max_days_old,
        sort_by: searchParams.sort_by
      });
      searchJobs(1);
    }
  }, []);

  const searchJobs = async (page = 1) => {
    if (!searchTerm && !location && !filters.category && !filters.company) {
      toast.error('Please enter search terms or select filters');
      return;
    }

    setIsLoading(true);
    setIsFilterLoading(true);
    try {
      const searchCriteria = {
        query: searchTerm,
        location,
        filters: { ...filters },
        page
      };
      setLastSearchCriteria(searchCriteria);

      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchTerm,
          location,
          page,
          ...filters
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
      
      setJobs(data.jobs);
      setPagination(data.pagination);
      
      // Update filter analytics
      if (data.analytics) {
        setFilterAnalytics(data.analytics);
      }
      
      // Update active filters based on results
      const newActiveFilters = new Set();
      if (filters.category) newActiveFilters.add('category');
      if (filters.contract_type) newActiveFilters.add('contract_type');
      if (filters.salary_min > 0 || filters.salary_max < 500000) newActiveFilters.add('salary');
      if (filters.company) newActiveFilters.add('company');
      if (filters.max_days_old !== 30) newActiveFilters.add('date');
      if (filters.sort_by !== 'date') newActiveFilters.add('sort');
      if (filters.experience_level) newActiveFilters.add('experience');
      if (filters.work_type) newActiveFilters.add('work_type');
      setActiveFilters(newActiveFilters);
      
      if (data.jobs.length === 0) {
        toast.info('No jobs found matching your criteria. Try adjusting your filters.');
      } else {
        toast.success(`Found ${data.pagination.total_results.toLocaleString()} jobs`);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      setJobs([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_results: 0,
        results_per_page: 20
      });
      
      if (error.message.includes('API responded with status')) {
        toast.error('The job search service is temporarily unavailable. Please try again later.');
      } else if (error.message.includes('Invalid API response format')) {
        toast.error('Received unexpected data from the job search service. Please try again.');
      } else {
        toast.error('Failed to search jobs. Please check your filters and try again.');
      }
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      searchJobs(newPage);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      contract_type: '',
      salary_min: 0,
      salary_max: 500000,
      company: '',
      max_days_old: 30,
      sort_by: 'date',
      experience_level: '',
      work_type: ''
    });
    setActiveFilters(new Set());
    toast.success('Filters cleared');
  };

  const saveSearchCriteria = () => {
    if (!lastSearchCriteria) return;
    
    const savedSearches = JSON.parse(localStorage.getItem('savedJobSearches') || '[]');
    const newSavedSearch = {
      id: Date.now(),
      ...lastSearchCriteria,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('savedJobSearches', JSON.stringify([newSavedSearch, ...savedSearches]));
    toast.success('Search criteria saved!');
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchTerm(savedSearch.query || '');
    setLocation(savedSearch.location || '');
    setFilters(savedSearch.filters);
    searchJobs(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.contract_type) count++;
    if (filters.salary_min > 0) count++;
    if (filters.salary_max < 500000) count++;
    if (filters.company) count++;
    if (filters.max_days_old !== 30) count++;
    if (filters.sort_by !== 'date') count++;
    if (filters.experience_level) count++;
    if (filters.work_type) count++;
    return count;
  };

  // Add function to apply preset
  const applyPreset = (preset) => {
    setFilters(preset.filters);
    searchJobs(1);
    toast.success(`Applied preset: ${preset.name}`);
  };

  // Add function to compare filters
  const compareFilters = async () => {
    setIsComparing(true);
    try {
      const baseFilters = { ...filters };
      const comparisons = [
        { name: 'Current Filters', filters: baseFilters },
        { name: 'Remote Only', filters: { ...baseFilters, work_type: 'remote' } },
        { name: 'Entry Level', filters: { ...baseFilters, experience_level: 'entry' } },
        { name: 'Last 7 Days', filters: { ...baseFilters, max_days_old: 7 } }
      ];

      const results = await Promise.all(
        comparisons.map(async (comparison) => {
          const response = await fetch('/api/jobs/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchTerm,
              location,
              page: 1,
              ...comparison.filters
            })
          });
          const data = await response.json();
          return {
            name: comparison.name,
            count: data.pagination.total_results,
            filters: comparison.filters
          };
        })
      );

      setComparisonResults(results);
      setShowComparison(true);
    } catch (error) {
      console.error('Error comparing filters:', error);
      toast.error('Failed to compare filters');
    } finally {
      setIsComparing(false);
    }
  };

  // Save custom preset
  const saveCustomPreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a name for your preset');
      return;
    }

    const newPreset = {
      id: Date.now(),
      name: newPresetName,
      description: newPresetDescription,
      filters: { ...filters }
    };

    const updatedPresets = [newPreset, ...customPresets];
    localStorage.setItem('customJobSearchPresets', JSON.stringify(updatedPresets));
    setCustomPresets(updatedPresets);
    setShowSavePresetDialog(false);
    setNewPresetName('');
    setNewPresetDescription('');
    toast.success('Preset saved successfully!');
  };

  // Delete custom preset
  const deleteCustomPreset = (presetId) => {
    const updatedPresets = customPresets.filter(preset => preset.id !== presetId);
    localStorage.setItem('customJobSearchPresets', JSON.stringify(updatedPresets));
    setCustomPresets(updatedPresets);
    toast.success('Preset deleted');
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
          <div className="flex gap-2">
            {lastSearchCriteria && (
              <Button
                variant="outline"
                size="sm"
                onClick={shareSearchUrl}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Search
              </Button>
            )}
            {savedSearches.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Saved Searches
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  {savedSearches.map((search) => (
                    <DropdownMenuItem
                      key={search.id}
                      onClick={() => loadSavedSearch(search)}
                      className="flex flex-col items-start gap-1 py-2"
                    >
                      <span className="font-medium">
                        {search.query || search.filters.category || 'All Jobs'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {search.location ? `${search.location} • ` : ''}
                        {new Date(search.savedAt).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchJobs(1);
                  }
                }}
                prefix={<Search className="w-4 h-4 text-muted-foreground" />}
              />
            </div>
            <div>
              <Input
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchJobs(1);
                  }
                }}
                prefix={<MapPin className="w-4 h-4 text-muted-foreground" />}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => searchJobs(1)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      >
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                    <SheetDescription>
                      Refine your job search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 pb-20">
                    <div className="space-y-6">
                      {/* Quick Filters Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Quick Filters
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSavePresetDialog(true)}
                            className="h-8 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Save Current
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {[...filterPresets, ...customPresets].map((preset) => (
                            <Button
                              key={preset.id || preset.name}
                              variant="outline"
                              className="w-full h-auto p-4 text-left relative group flex flex-col items-start"
                              onClick={() => applyPreset(preset)}
                            >
                              <div className="pr-8 w-full">
                                <div className="font-medium text-sm mb-1 truncate">
                                  {preset.name}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {preset.description}
                                </div>
                              </div>
                              {preset.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-3 right-3 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomPreset(preset.id);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <BarChart2 className="w-4 h-4" />
                            Filter Comparison
                          </h3>
                          {showComparison && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowComparison(false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {showComparison ? (
                          <div className="space-y-4">
                            <div className="h-[200px]">
                              <Bar
                                data={{
                                  labels: comparisonResults.map(r => r.name),
                                  datasets: [{
                                    label: 'Number of Jobs',
                                    data: comparisonResults.map(r => r.count),
                                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                    borderColor: 'rgb(59, 130, 246)',
                                    borderWidth: 1
                                  }]
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      ticks: {
                                        callback: (value) => value.toLocaleString()
                                      }
                                    }
                                  },
                                  plugins: {
                                    tooltip: {
                                      callbacks: {
                                        label: (context) => `${context.raw.toLocaleString()} jobs`
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              {comparisonResults.map((result) => (
                                <div
                                  key={result.name}
                                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                                >
                                  <span className="text-sm">{result.name}</span>
                                  <span className="text-sm font-medium">{result.count.toLocaleString()} jobs</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={compareFilters}
                            disabled={isComparing}
                          >
                            {isComparing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Comparing...
                              </div>
                            ) : (
                              'Compare Filter Options'
                            )}
                          </Button>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Job Category
                            {filters.category && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, category: ''})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.category} 
                            onValueChange={(value) => setFilters({...filters, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Contract Type
                            {filters.contract_type && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, contract_type: ''})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.contract_type} 
                            onValueChange={(value) => setFilters({...filters, contract_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select contract type" />
                            </SelectTrigger>
                            <SelectContent>
                              {contractTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Salary Range
                            {(filters.salary_min > 0 || filters.salary_max < 500000) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, salary_min: 0, salary_max: 500000})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-muted-foreground">Minimum</label>
                              <Input
                                type="number"
                                value={filters.salary_min || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                  setFilters({...filters, salary_min: value});
                                }}
                                min="0"
                                step="10000"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">Maximum</label>
                              <Input
                                type="number"
                                value={filters.salary_max || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 500000 : parseInt(e.target.value);
                                  setFilters({...filters, salary_max: value});
                                }}
                                min="0"
                                step="10000"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Company Name
                            {filters.company && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, company: ''})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Input
                            placeholder="Filter by company"
                            value={filters.company}
                            onChange={(e) => setFilters({...filters, company: e.target.value})}
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Experience Level
                            {filters.experience_level && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, experience_level: ''})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.experience_level} 
                            onValueChange={(value) => setFilters({...filters, experience_level: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center justify-between">
                                    <span>{level.label}</span>
                                    {filterAnalytics.experienceLevels[level.value] && (
                                      <span className="text-xs text-muted-foreground ml-2">
                                        ({filterAnalytics.experienceLevels[level.value]})
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Work Type
                            {filters.work_type && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, work_type: ''})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.work_type} 
                            onValueChange={(value) => setFilters({...filters, work_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select work type" />
                            </SelectTrigger>
                            <SelectContent>
                              {workTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center justify-between">
                                    <span>{type.label}</span>
                                    {filterAnalytics.workTypes[type.value] && (
                                      <span className="text-xs text-muted-foreground ml-2">
                                        ({filterAnalytics.workTypes[type.value]})
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Posted Within
                            {filters.max_days_old !== 30 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, max_days_old: 30})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.max_days_old.toString()} 
                            onValueChange={(value) => setFilters({...filters, max_days_old: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Last 24 hours</SelectItem>
                              <SelectItem value="7">Last 7 days</SelectItem>
                              <SelectItem value="14">Last 2 weeks</SelectItem>
                              <SelectItem value="30">Last month</SelectItem>
                              <SelectItem value="90">Last 3 months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            Sort By
                            {filters.sort_by !== 'date' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({...filters, sort_by: 'date'})}
                                className="h-4 p-0 ml-2 hover:bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </h3>
                          <Select 
                            value={filters.sort_by} 
                            onValueChange={(value) => setFilters({...filters, sort_by: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Save Search Section */}
                        {lastSearchCriteria && (
                          <div className="mt-6">
                            <Separator className="mb-4" />
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={saveSearchCriteria}
                            >
                              Save Current Search
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer with Apply Button */}
                  <div className="fixed bottom-0 right-0 w-[400px] sm:w-[380px] p-4 bg-background border-t">
                    <div className="max-w-[312px] sm:max-w-[422px] mx-auto">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          searchJobs(1);
                          document.querySelector('[data-radix-collection-item]')?.click();
                        }}
                        disabled={isFilterLoading}
                      >
                        {isFilterLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Applying Filters...
                          </div>
                        ) : (
                          'Show Results'
                        )}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Card>

        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {jobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {job.company}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                        {job.type && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.type}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.posted_at).toLocaleDateString()}
                        </Badge>
                        {job.salary && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                            {job.salary_is_predicted && ' (Estimated)'}
                          </Badge>
                        )}
                        {job.category && (
                          <Badge variant="secondary">
                            {job.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="default"
                        onClick={() => window.open(job.url, '_blank')}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newApplication = {
                            id: Date.now(),
                            company: job.company,
                            position: job.title,
                            location: job.location,
                            status: 'saved',
                            url: job.url,
                            createdAt: new Date().toISOString(),
                            salary: job.salary,
                            type: job.type,
                            category: job.category,
                            contract_type: job.contract_type
                          };

                          const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
                          localStorage.setItem('jobApplications', JSON.stringify([newApplication, ...existingApplications]));
                          toast.success('Added to job tracker!');
                        }}
                      >
                        Save Job
                      </Button>
                    </div>
                  </div>
                  {job.description && (
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      {job.description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          searchTerm && !isLoading && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No jobs found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or filters
              </p>
            </div>
          )
        )}
      </div>

      {/* Save Preset Dialog */}
      <Dialog open={showSavePresetDialog} onOpenChange={setShowSavePresetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search Preset</DialogTitle>
            <DialogDescription>
              Save your current search filters as a preset for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="presetName">Preset Name</Label>
              <Input
                id="presetName"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., Remote Senior Developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presetDescription">Description</Label>
              <Input
                id="presetDescription"
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                placeholder="e.g., High-paying remote positions for senior developers"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSavePresetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveCustomPreset}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
