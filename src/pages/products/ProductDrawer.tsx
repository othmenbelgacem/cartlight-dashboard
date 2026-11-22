import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/fields'
import { Drawer } from '../../components/ui/Overlays'
import { variantsFor } from '../../data/variants'
import type { Product, ProductStatus } from '../../data/types'
import { formatTnd } from '../../lib/format'
import { ProductArt } from './ProductArt'
import {
  DESCRIPTION_MAX,
  EMPTY_VALUES,
  FIELD_LABELS,
  FIELD_ORDER,
  NAME_MAX,
  parseProduct,
  toFormValues,
  validateProduct,
  type ProductErrors,
  type ProductField,
  type ProductFormValues,
} from './validateProduct'

const CATEGORIES: Product['category'][] = ['Kitchen', 'Home', 'Beauty', 'Food', 'Fashion']

type ProductDrawerProps = {
  /** A product to edit, "new" to add one, or null to keep the drawer closed. */
  draft: Product | 'new' | null
  /** The id a new product will get. */
  nextId: string
  onClose: () => void
  onSave: (product: Product) => void
}

/** A form for editing or adding a product, with plain-language validation. */
export function ProductDrawer({ draft, nextId, onClose, onSave }: ProductDrawerProps) {
  // The page gives this component a new key for each product, so the form starts fresh every time.
  const product = draft && draft !== 'new' ? draft : null
  const [values, setValues] = useState<ProductFormValues>(() =>
    product ? toFormValues(product) : EMPTY_VALUES,
  )
  const [errors, setErrors] = useState<ProductErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const stockRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  function focusField(field: ProductField) {
    const fields = { name: nameRef, price: priceRef, stock: stockRef, description: descriptionRef }
    fields[field].current?.focus()
  }

  function update(change: Partial<ProductFormValues>) {
    const next = { ...values, ...change }
    setValues(next)
    // After the first try, mistakes disappear as soon as they are fixed.
    if (submitted) setErrors(validateProduct(next))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const found = validateProduct(values)
    setSubmitted(true)
    setErrors(found)
    const first = FIELD_ORDER.find((field) => found[field])
    if (first) {
      focusField(first)
      return
    }
    onSave(parseProduct(values, product?.id ?? nextId))
  }

  const invalid = FIELD_ORDER.filter((field) => errors[field])
  const variants = product ? variantsFor(product) : []

  return (
    <Drawer
      open={draft !== null}
      onClose={onClose}
      title={product ? `Edit ${product.name}` : 'Add product'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="product-form">
            {product ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} noValidate className="grid gap-5">
        {invalid.length > 0 && (
          <div role="alert" className="rounded-xl border border-hot p-3 text-sm text-hot">
            Fix {invalid.length} {invalid.length === 1 ? 'field' : 'fields'} to continue:{' '}
            {invalid.map((field) => FIELD_LABELS[field]).join(', ')}.
          </div>
        )}

        {product && (
          <div className="overflow-hidden rounded-xl">
            <ProductArt product={{ ...product, category: values.category }} />
          </div>
        )}

        <Input
          ref={nameRef}
          label="Name"
          value={values.name}
          maxLength={NAME_MAX + 20}
          onChange={(event) => update({ name: event.target.value })}
          error={errors.name}
        />
        <Select
          label="Category"
          value={values.category}
          onChange={(event) => update({ category: event.target.value as Product['category'] })}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            ref={priceRef}
            label="Price (TND)"
            type="number"
            inputMode="decimal"
            step="0.001"
            value={values.price}
            hint="Up to 3 decimals."
            onChange={(event) => update({ price: event.target.value })}
            error={errors.price}
          />
          <Input
            ref={stockRef}
            label="Stock"
            type="number"
            inputMode="numeric"
            step="1"
            value={values.stock}
            hint="Items on the shelf."
            onChange={(event) => update({ stock: event.target.value })}
            error={errors.stock}
          />
        </div>
        <Select
          label="Status"
          value={values.status}
          onChange={(event) => update({ status: event.target.value as ProductStatus })}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
        <Textarea
          ref={descriptionRef}
          label="Description"
          value={values.description}
          hint={`${values.description.length} of ${DESCRIPTION_MAX} characters.`}
          onChange={(event) => update({ description: event.target.value })}
          error={errors.description}
        />

        {product && (
          <div>
            <h3 className="font-display text-lg font-bold">Variants</h3>
            <p className="mt-1 text-sm text-muted">
              Each version of this product. Their stock adds up to the saved stock above.
            </p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[22rem] border-collapse text-sm">
                <caption className="sr-only">Variants of {product.name}</caption>
                <thead className="bg-raised text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-start font-medium">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-2 text-start font-medium">
                      Option
                    </th>
                    <th scope="col" className="px-3 py-2 text-end font-medium">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-2 text-end font-medium">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.sku} className="border-t border-line">
                      <td className="px-3 py-2 tabular-nums">{variant.sku}</td>
                      <td className="px-3 py-2">{variant.option}</td>
                      <td className="px-3 py-2 text-end tabular-nums">
                        {formatTnd(variant.price)}
                      </td>
                      <td className="px-3 py-2 text-end tabular-nums">{variant.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </form>
    </Drawer>
  )
}
