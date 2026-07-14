import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EAcceptFile } from "@/lib/enum";
import { cn, getFileName, makeid, urlImageStoreGoogle } from "@/lib/utils";
import { CheckIcon, Loader2Icon, PlusCircleIcon, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { notifyError } from "../Toaster";
import { Input } from "../ui/input";

interface FileProps {
  id: string;
  pic: any;
  error: string;
}

interface InputFilesProps {
  label?: React.ReactNode;
  pics: FileProps[];
  setPics: Dispatch<SetStateAction<FileProps[]>>;
  multiplePics?: boolean;
  maxPics?: number;
  options: {
    size: number;
    location: string;
  };
  accept: keyof typeof EAcceptFile;
  uploadData: any;
  isRequired?: boolean;
}

const InputFiles = ({
  label,
  pics,
  setPics,
  multiplePics = true,
  maxPics,
  options,
  accept,
  uploadData,
  isRequired,
}: InputFilesProps) => {
  const { size, location } = options;

  const [loadings, setLoadings] = useState<{ id: string; loading: boolean }[]>([]);

  const handleUploadPic = async (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const files = event?.target.files;
    setLoadings(
      loadings?.map((loading) => {
        if (loading?.id == id) {
          return {
            ...loading,
            loading: true,
          };
        }

        return loading;
      })
    );

    try {
      if (!files?.[0]) {
        throw "Tidak ada file yang diupload, silahkan coba lagi!";
      }

      if (files?.[0]?.size > size * 1000000) {
        throw "Ukuran file yang diupload terlalu besar, silahkan coba lagi!";
      }

      const formData = new FormData();

      formData.append("file", files?.[0]);
      formData.append("destination", location);

      const response = await uploadData(formData);

      // SET URL AFTER UPLOAD TO STATE
      setPics(
        pics?.map((pic) => {
          if (pic?.id == id) {
            return {
              id,
              pic: response?.data?.[0]?.file_url,
              error: "",
              loading: false,
            };
          }

          return pic;
        })
      );
      ``;
    } catch (error: any) {
      setPics(
        pics?.map((pic) => {
          if (pic?.id == id) {
            return {
              id,
              pic: "",
              loading: false,
              error:
                error?.error_message || error?.message || error || "Terjadi kesalahan, gagal melakukan unggah file",
            };
          }

          return pic;
        })
      );
    } finally {
      setLoadings(
        loadings?.map((loading) => {
          if (loading?.id == id) {
            return {
              ...loading,
              loading: false,
            };
          }

          return loading;
        })
      );
    }
  };

  const addPic = () => {
    if (maxPics) {
      if (pics?.length < maxPics) {
        setPics([...pics, { id: makeid(), pic: "", error: "" }]);
      } else {
        notifyError(`Maks. ${maxPics} File`);
      }
    } else {
      setPics([...pics, { id: makeid(), pic: "", error: "" }]);
    }
  };

  const removePic = (id: string) => {
    setPics(pics?.filter((pic) => pic?.id !== id));
  };

  useEffect(() => {
    setLoadings(
      pics?.map((pic) => ({
        id: pic?.id,
        loading: false,
      }))
    );
  }, [pics]);

  return (
    <>
      {pics?.map((pic, picIndex) => {
        const isLoading = loadings?.find((loading) => loading?.id == pic?.id)?.loading;
        const dataPic = pic?.pic;
        return (
          <div key={pic?.id} className={cn("flex ", pic?.error ? "items-center" : "items-end")}>
            <FormField
              name={pic?.id}
              render={({ field }) => (
                <FormItem className="dark:text-secondary/70 w-full">
                  {/* Label + ukuran */}
                  {label && (
                    <FormLabel aria-required={isRequired}>
                      <p className="font-medium">{label}</p>
                      <span className="text-xs text-gray-500">(Maks. {size} MB)</span>
                    </FormLabel>
                  )}

                  {/* Jika ada file terupload */}
                  {pic?.pic && (
                    <div className=" flex items-center gap-2 text-xs text-gray-600">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <Link
                        className="underline hover:text-primary"
                        target="_blank"
                        href={urlImageStoreGoogle(dataPic)}
                        download={getFileName(dataPic)}
                      >
                        Lihat File
                      </Link>
                    </div>
                  )}

                  {/* Input File */}
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        id={`file-` + pic?.id}
                        className="hidden"
                        {...field}
                        onChange={(event) => handleUploadPic(event, pic?.id)}
                        accept={EAcceptFile[accept]}
                      />

                      <label
                        htmlFor={`file-` + pic?.id}
                        className={cn(
                          " flex h-[38px] w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ring-offset-white hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-950 dark:ring-offset-primary-900",
                          isLoading
                            ? "bg-gray-100 text-gray-500"
                            : pic?.pic
                            ? "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-100"
                            : "border-primary text-primary hover:bg-gray-50"
                        )}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                            <span>Mengupload...</span>
                          </div>
                        ) : (
                          <span>{pic?.pic ? "Ubah File" : "Pilih File"}</span>
                        )}
                      </label>
                    </>
                  </FormControl>

                  {/* Error Message */}
                  <FormMessage>{pic?.error}</FormMessage>
                </FormItem>
              )}
            />

            {pics?.length > 1 ? (
              <Button type="button" size="icon" variant="destructive" onClick={() => removePic(pic?.id)}>
                <X className="w-4" />
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      })}

      {multiplePics && (
        <Button type="button" size="sm" onClick={() => addPic()}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Tambah
        </Button>
      )}
    </>
  );
};

export default InputFiles;
